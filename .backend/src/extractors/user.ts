import { Err, Ok, Option, Result } from "../lib/util";
import extractToken, { SchemeType } from "./token";

import { HttpRequest } from "@azure/functions";
import JWKS from "../lib/jwsk";
import User from "../models/user";
import { z } from "zod";

export default async function extractUser(
  request: HttpRequest
): Promise<Result<Option<User>>> {
  const token = await extractToken(request);

  if (!token.ok) {
    return Err(new Error("Failed to extract token"));
  }

  if (!token.value.some) {
    return Err(new Error("No token provided"));
  }

  if (token.value.value.type !== SchemeType.Bearer) {
    return Err(new Error("Invalid token type"));
  }

  const decoded = await JWKS.getInstance().verifyToken(token.value.value.token);

  if (!decoded.ok) {
    return Err(new Error("Failed to verify token"));
  }

  const result = z
    .object({
      oid: z.string(),
      name: z.string(),
    })
    .parse(decoded.value.payload);

  const user = await User.get(result.oid);

  return Ok(user);
}
