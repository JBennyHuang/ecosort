import AADB2C, { AuthorizeResponse, TokenResponse } from "@/lib/aadb2c";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { makeRedirectUri } from "expo-auth-session";

type C =
  | {
      isSignedIn: false;
      signIn(): Promise<void>;
    }
  | {
      isSignedIn: true;
      token: string;
      refresh(): Promise<void>;
      signOut(): Promise<void>;
    };

const AuthContext = createContext<C | null>(null);

function AuthProvider(props: { children: ReactNode }) {
  // const redirectUri = makeRedirectUri({ scheme: "myapp", path: "auth" });
  const redirectUri = "exp://127.0.0.1:8081/--/auth"; // TODO: uncomment the above line and remove this line for production

  console.log(redirectUri);

  const [code, setCode] = useState<AuthorizeResponse | null>(null);
  const [token, setToken] = useState<TokenResponse | null>(null);

  const signIn = useCallback(async () => {
    const result = await AADB2C.getInstance().authorize(redirectUri);

    if (!result.ok) {
      console.error(result.error);
    } else {
      setCode(result.value);
    }
  }, []);

  const signOut = useCallback(async () => {
    const result = await AADB2C.getInstance().logout(redirectUri);

    if (!result.ok) {
      console.error(result.error);
    } else {
      setCode(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    if (!code) {
      return;
    }

    (async () => {
      const result = await AADB2C.getInstance().token(
        code.code,
        redirectUri,
        code.codeVerifier
      );

      if (!result.ok) {
        console.error(result.error);
      } else {
        setToken(result.value);
      }
    })();
  }, [code]);

  const refresh = useCallback(async () => {
    if (!token) {
      return;
    }

    const result = await AADB2C.getInstance().token(
      "",
      "",
      "",
      token.refresh_token
    );

    if (!result.ok) {
      console.error(result.error);
    } else {
      setToken(result.value);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={
        !code || !token
          ? {
              isSignedIn: false,
              signIn,
            }
          : {
              isSignedIn: true,
              token: token.id_token,
              refresh,
              signOut,
            }
      }
      {...props}
    />
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
