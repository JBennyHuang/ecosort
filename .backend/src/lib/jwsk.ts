import * as jwt from "jsonwebtoken";

import { Err, Ok, Result } from "./util";

import { Config } from "../constants/config";
import { JwksClient } from "jwks-rsa";

export default class JWKS {
  static #instance?: JWKS;

  client: JwksClient;

  private constructor() {
    this.client = new JwksClient({
      jwksUri: `https://${Config.aadb2c.tenant}.b2clogin.com/${Config.aadb2c.tenant}.onmicrosoft.com/${Config.aadb2c.policy}/discovery/v2.0/keys`,
    });
  }

  static getInstance(): JWKS {
    if (!this.#instance) {
      this.#instance = new JWKS();
    }

    return this.#instance;
  }

  // https://learn.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview#validation
  // https://www.npmjs.com/package/jsonwebtoken
  async verifyToken(token: string): Promise<Result<jwt.Jwt>> {
    const getKey = (
      header: jwt.JwtHeader,
      callback: jwt.SigningKeyCallback
    ) => {
      this.client.getSigningKey(header.kid, (error, key) => {
        if (error) {
          callback(error);
        } else {
          callback(null, key.getPublicKey());
        }
      });
    };

    return new Promise((resolve) => {
      jwt.verify(token, getKey, { complete: true }, (error, decoded) => {
        if (error) {
          resolve(Err(error));
        } else {
          resolve(Ok(decoded));
        }
      });
    });
  }
}
