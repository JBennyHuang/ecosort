import { None, Option, Some } from "../lib/util";

import DB from "../lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  name: z.string(),
  badges: z.array(z.string()),
  points: z.number(),
});

type IUser = z.infer<typeof schema>;

export default class User implements IUser {
  public readonly id: string;
  public readonly name: string;
  public readonly badges: string[];
  public readonly points: number;

  private constructor(data: unknown) {
    const result = schema.parse(data);

    this.id = result.id;
    this.name = result.name;
    this.badges = result.badges;
    this.points = result.points;
  }

  static async get(id: string): Promise<Option<User>> {
    const users = await DB.getInstance().users();
    const user = await users.item(id).read();

    if (user.statusCode === 404) {
      return None;
    }

    return Some(new User(user.resource));
  }
}
