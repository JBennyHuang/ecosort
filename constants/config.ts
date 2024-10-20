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

export const Config = {
  openAI: {
    endpoint: process.env.EXPO_PUBLIC_OPENAI_ENDPOINT,
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    apiVersion: process.env.EXPO_PUBLIC_OPENAI_API_VERSION,
    model: process.env.EXPO_PUBLIC_OPENAI_MODEL,
  },
};
