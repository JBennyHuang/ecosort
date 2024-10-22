declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AZURE_COSMOS_DB_ENDPOINT?: string;
      AZURE_COSMOS_DB_KEY?: string;
    }
  }
}

export {};
