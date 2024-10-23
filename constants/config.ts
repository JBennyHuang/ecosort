if (!process.env.EXPO_PUBLIC_OPENAI_ENDPOINT) {
  throw new Error("EXPO_PUBLIC_OPENAI_ENDPOINT is not set");
}

if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
  throw new Error("EXPO_PUBLIC_OPENAI_API_KEY is not set");
}

if (!process.env.EXPO_PUBLIC_OPENAI_API_VERSION) {
  throw new Error("EXPO_PUBLIC_OPENAI_API_VERSION is not set");
}

if (!process.env.EXPO_PUBLIC_OPENAI_MODEL) {
  throw new Error("EXPO_PUBLIC_OPENAI_MODEL is not set");
}

if (!process.env.EXPO_PUBLIC_AAD_B2C_TENANT) {
  throw new Error("EXPO_PUBLIC_AAD_B2C_TENANT is not set");
}

if (!process.env.EXPO_PUBLIC_AAD_B2C_POLICY) {
  throw new Error("EXPO_PUBLIC_AAD_B2C_POLICY is not set");
}

if (!process.env.EXPO_PUBLIC_AAD_B2C_CLIENT_ID) {
  throw new Error("EXPO_PUBLIC_AAD_B2C_CLIENT_ID is not set");
}

if (!process.env.EXPO_PUBLIC_AAD_B2C_SCOPES) {
  throw new Error("EXPO_PUBLIC_AAD_B2C_SCOPES is not set");
}

export const Config = {
  openai: {
    endpoint: process.env.EXPO_PUBLIC_OPENAI_ENDPOINT,
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    apiVersion: process.env.EXPO_PUBLIC_OPENAI_API_VERSION,
    model: process.env.EXPO_PUBLIC_OPENAI_MODEL,
  },
  aadb2c: {
    tenant: process.env.EXPO_PUBLIC_AAD_B2C_TENANT,
    policy: process.env.EXPO_PUBLIC_AAD_B2C_POLICY,
    clientId: process.env.EXPO_PUBLIC_AAD_B2C_CLIENT_ID,
    scopes: process.env.EXPO_PUBLIC_AAD_B2C_SCOPES.split(","),
  },
};
