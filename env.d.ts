declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_OPENAI_ENDPOINT?: string;
      EXPO_PUBLIC_OPENAI_API_KEY?: string;
      EXPO_PUBLIC_OPENAI_API_VERSION?: string;
      EXPO_PUBLIC_OPENAI_MODEL?: string;
    }
  }
}

export {};
