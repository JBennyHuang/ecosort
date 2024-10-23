import { Config } from "../constants/config";
import { CosmosClient } from "@azure/cosmos";

export default class DB {
  static #instance?: DB;

  client: CosmosClient;

  private constructor() {
    this.client = new CosmosClient({
      endpoint: Config.cosmosDB.endpoint,
      key: Config.cosmosDB.key,
    });
  }

  static getInstance(): DB {
    if (!this.#instance) {
      this.#instance = new DB();
    }

    return this.#instance;
  }

  async init() {
    return await this.client.databases.createIfNotExists({ id: "dev" });
  }

  async users() {
    const { database } = await this.init();
    const { container } = await database.containers.createIfNotExists({
      id: "users",
    });

    return container;
  }
}
