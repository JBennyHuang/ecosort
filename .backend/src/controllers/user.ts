import { HttpRequest, InvocationContext } from "@azure/functions";

import extractUser from "../extractors/user";
import { z } from "zod";

export default class UserController {
  static async getMe(request: HttpRequest, context: InvocationContext) {
    try {
      const user = await extractUser(request);

      if (user.ok === false) {
        context.error(user.error);

        return {
          status: 401,
          body: JSON.stringify({
            message: "Unauthorized",
          }),
        };
      }

      if (user.value.some === false) {
        context.info("User not found");

        return {
          status: 404,
          body: JSON.stringify({
            message: "User not found",
          }),
        };
      }

      return {
        status: 200,
        body: JSON.stringify(user.value.value),
      };
    } catch (error) {
      context.error(error);

      return {
        status: 500,
        body: JSON.stringify({
          message: "Internal server error",
        }),
      };
    }
  }

  static async increasePoints(
    request: HttpRequest,
    context: InvocationContext
  ) {
    try {
      const user = await extractUser(request);

      if (user.ok === false) {
        context.error(user.error);

        return {
          status: 401,
          body: JSON.stringify({
            message: "Unauthorized",
          }),
        };
      }

      if (user.value.some === false) {
        context.info("User not found");

        return {
          status: 404,
          body: JSON.stringify({
            message: "User not found",
          }),
        };
      }

      const params = z
        .object({
          points: z.number(),
        })
        .parse(await request.json());

      const result = await user.value.value.increasePoints(params.points);

      if (result.ok === false) {
        throw result.error;
      }

      return {
        status: 200,
        body: "",
      };
    } catch (error) {
      context.error(error);

      return {
        status: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }
}
