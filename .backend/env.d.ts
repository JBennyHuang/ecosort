declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COSMOS_DB_ENDPOINT?: string;
      COSMOS_DB_KEY?: string;
      AAD_B2C_TENANT?: string;
      AAD_B2C_POLICY?: string;
    }
  }
}

export {};
