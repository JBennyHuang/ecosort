import * as WebBrowser from "expo-web-browser";

import { Err, Ok, Result } from "./util";

import { Config } from "@/constants/config";
import { buildCodeAsync } from "expo-auth-session/build/PKCE";
import { randomUUID } from "expo-crypto";
import { z } from "zod";

WebBrowser.maybeCompleteAuthSession();

export type AuthorizeResponse = {
  code: string;
  state: string;
  codeVerifier: string;
};

export type TokenResponse = {
  id_token: string;
  id_token_expires_in: number;
  not_before: number;
  profile_info: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
};

export default class AADB2C {
  static #instance?: AADB2C;

  tenant: string;
  policy: string;
  clientId: string;
  scopes: string[];

  private constructor() {
    this.tenant = Config.aadb2c.tenant;
    this.policy = Config.aadb2c.policy;
    this.clientId = Config.aadb2c.clientId;
    this.scopes = Config.aadb2c.scopes;
  }

  public static getInstance(): AADB2C {
    if (!AADB2C.#instance) {
      AADB2C.#instance = new AADB2C();
    }

    return AADB2C.#instance;
  }

  // https://learn.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#1-get-an-authorization-code
  async authorize(redirectUri: string): Promise<Result<AuthorizeResponse>> {
    try {
      const state = randomUUID();
      const { codeChallenge, codeVerifier } = await buildCodeAsync();

      const url = new URL(
        `https://${this.tenant}.b2clogin.com/${this.tenant}.onmicrosoft.com/${this.policy}/oauth2/v2.0/authorize`
      );

      url.searchParams.set("client_id", this.clientId);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("scope", this.scopes.join(" "));
      url.searchParams.set("response_mode", "query");
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");

      const result = await WebBrowser.openAuthSessionAsync(
        url.toString(),
        redirectUri
      );

      if (result.type !== "success") {
        throw new Error("Failed to authorize");
      }

      const schema = z.object({
        code: z.string(),
        state: z.string(),
      });

      const parsedResult = schema.parse(
        Object.fromEntries(new URL(result.url).searchParams.entries())
      );

      if (parsedResult.state !== state) {
        throw new Error("State mismatch");
      }

      return Ok({ ...parsedResult, codeVerifier });
    } catch (error) {
      return Err(error instanceof Error ? error : new Error("Unknown error"));
    }
  }

  // https://learn.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#2-get-an-access-token
  // https://learn.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow#4-refresh-the-token
  async token(
    code: string,
    redirectUri: string,
    codeVerifier: string,
    refreshToken?: string
  ): Promise<Result<TokenResponse>> {
    try {
      const url = new URL(
        `https://${this.tenant}.b2clogin.com/${this.tenant}.onmicrosoft.com/${this.policy}/oauth2/v2.0/token`
      );

      if (!refreshToken) {
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("grant_type", "authorization_code");
        url.searchParams.set("code", code);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("code_verifier", codeVerifier);
      } else {
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("grant_type", "refresh_token");
        url.searchParams.set("refresh_token", refreshToken);
      }

      const result = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!result.ok) {
        throw new Error("Failed to get token");
      }

      const schema = z.object({
        id_token: z.string(),
        id_token_expires_in: z.number(),
        not_before: z.number(),
        profile_info: z.string(),
        refresh_token: z.string(),
        refresh_token_expires_in: z.number(),
        scope: z.string(),
        token_type: z.string(),
      });

      const parsedResult = schema.parse(await result.json());

      return Ok(parsedResult);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error("Unknown error"));
    }
  }

  // https://learn.microsoft.com/en-us/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
  async logout(redirectUri: string): Promise<Result<{}>> {
    try {
      const url = new URL(
        `https://${this.tenant}.b2clogin.com/${this.tenant}.onmicrosoft.com/${this.policy}/oauth2/v2.0/logout`
      );

      url.searchParams.set("post_logout_redirect_uri", redirectUri);

      const result = await WebBrowser.openAuthSessionAsync(
        url.toString(),
        redirectUri
      );

      if (result.type !== "success") {
        throw new Error("Failed to authorize");
      }

      return Ok({});
    } catch (error) {
      return Err(error instanceof Error ? error : new Error("Unknown error"));
    }
  }
}
