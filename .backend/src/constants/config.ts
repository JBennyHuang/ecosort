if (!process.env.COSMOS_DB_ENDPOINT) {
  throw new Error("COSMOS_DB_ENDPOINT is not set");
}

if (!process.env.COSMOS_DB_KEY) {
  throw new Error("COSMOS_DB_KEY is not set");
}

if (!process.env.AAD_B2C_TENANT) {
  throw new Error("AAD_B2C_TENANT is not set");
}

if (!process.env.AAD_B2C_POLICY) {
  throw new Error("AAD_B2C_POLICY is not set");
}

export const Config = {
  cosmosdb: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
  },
  aadb2c: {
    tenant: process.env.AAD_B2C_TENANT,
    policy: process.env.AAD_B2C_POLICY,
  },
};
