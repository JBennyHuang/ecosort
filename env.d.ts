declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_OPENAI_ENDPOINT?: string;
      EXPO_PUBLIC_OPENAI_API_KEY?: string;
      EXPO_PUBLIC_OPENAI_API_VERSION?: string;
      EXPO_PUBLIC_OPENAI_MODEL?: string;
      EXPO_PUBLIC_AAD_B2C_TENANT?: string;
      EXPO_PUBLIC_AAD_B2C_POLICY?: string;
      EXPO_PUBLIC_AAD_B2C_CLIENT_ID?: string;
      EXPO_PUBLIC_AAD_B2C_SCOPES?: string;
    }
  }
}

export {};
