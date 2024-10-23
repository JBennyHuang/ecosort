import { AzureOpenAI } from "openai";
import { Config } from "@/constants/config";

export default class LLM {
  static #instance?: LLM;

  client: AzureOpenAI;

  private constructor() {
    this.client = new AzureOpenAI({
      endpoint: Config.openai.endpoint,
      apiKey: Config.openai.apiKey,
      apiVersion: Config.openai.apiVersion,
    });
  }

  public static getInstance(): LLM {
    if (!LLM.#instance) {
      LLM.#instance = new LLM();
    }

    return LLM.#instance;
  }

  async identify(base64: string) {
    return await this.client.chat.completions.create({
      model: Config.openai.model,
      messages: [
        {
          role: "system",
          content:
            "You are an AI-powered garbage-sorting assistant. Your primary role is to help users identify the type of garbage or recyclable material based on images they provide and guide them on which disposal bin or recycling category it should be placed into, according to the waste management rules of Canada, specifically the province of Ontario. You must analyze images provided by the user to determine whether the item is garbage, recycling, or compost, and provide the correct bin or disposal method (Blue Bin for recycling, Green Bin for compost, Garbage for landfill, or Special Disposal for regulated materials). Follow only the waste management guidelines of Ontario, Canada, and ignore any non-garbage-related inquiries or waste management systems outside of Ontario. If an image cannot be identified, ask the user for clarification or provide general instructions based on the closest match.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Hi, can you tell me which bin this item should go into? I'm not sure if it's recyclable or needs to go in the garbage.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
                detail: "auto",
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });
  }
}
