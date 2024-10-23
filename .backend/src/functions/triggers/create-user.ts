import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from "@azure/functions";

import DB from "../../lib/db";
import { z } from "zod";

export async function createUserTrigger(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const credentials = request.headers.get("Authorization")?.split(" ").at(1);

  if (credentials !== btoa("admin:admin")) {
    return {
      body: JSON.stringify({
        version: "1.0.0",
        action: "ShowBlockPage",
        userMessage: "You are not authorized to access this resource",
      }),
    };
  }

  const body = await request.json();

  context.log("Validing body:", body);

  const bodySchema = z.object({
    objectId: z.string(),
    displayName: z.string(),
  });

  const validatedBody = bodySchema.parse(body);

  context.log("Initializing database connection");

  const db = DB.getInstance();

  context.log("Loading users container");

  const users = await db.users();

  context.log("Reading user");

  const user = await users.item(validatedBody.objectId).read();

  context.log("User status code:", user.statusCode);

  context.log("Creating user if not exists");

  if (user.statusCode === 404) {
    users.items.create({
      id: validatedBody.objectId,
      name: validatedBody.displayName,
      badges: [],
      points: 0,
    });
  }

  return {
    body: JSON.stringify({
      version: "1.0.0",
      action: "Continue",
    }),
  };
}

app.post("create-user-trigger", {
  route: "trigger/create-user",
  handler: createUserTrigger,
});
