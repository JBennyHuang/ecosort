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

  const schema = z.object({
    objectId: z.string(),
    displayName: z.string(),
  });

  const result = schema.parse(body);

  const users = await DB.getInstance().users();
  const user = await users.item(result.objectId).read();

  if (user.statusCode === 404) {
    users.items.create({
      id: result.objectId,
      name: result.displayName,
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
