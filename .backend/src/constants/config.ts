if (!process.env.AZURE_COSMOS_DB_ENDPOINT) {
  throw new Error("AZURE_COSMOS_DB_ENDPOINT is not set");
}

if (!process.env.AZURE_COSMOS_DB_KEY) {
  throw new Error("AZURE_COSMOS_DB_KEY is not set");
}

export const Config = {
  cosmosDB: {
    endpoint: process.env.AZURE_COSMOS_DB_ENDPOINT,
    key: process.env.AZURE_COSMOS_DB_KEY,
  },
};
