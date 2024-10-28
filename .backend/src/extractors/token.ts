import { Err, None, Ok, Option, Result, Some } from "../lib/util";

import { HttpRequest } from "@azure/functions";
import { z } from "zod";

export enum SchemeType {
  Basic = "Basic",
  Bearer = "Bearer",
}

export default async function extractToken(
  request: HttpRequest
): Promise<Result<Option<{ type: SchemeType; token: string }>>> {
  try {
    const authorization = request.headers.get("Authorization")?.split(" ");

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
    const [scheme, parameters] = z
      .tuple([z.enum(["Basic", "Bearer"]), z.string()])
      .parse(authorization);

    switch (scheme) {
      case "Basic":
        return Ok(Some({ type: SchemeType.Basic, token: parameters }));

      case "Bearer":
        return Ok(Some({ type: SchemeType.Bearer, token: parameters }));

      default:
        return Ok(None);
    }
  } catch (error) {
    return Err(error instanceof Error ? error : new Error("Unknown error"));
  }
}
