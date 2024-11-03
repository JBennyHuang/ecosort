import { HttpRequest, InvocationContext } from "@azure/functions";

import extractUser from "../extractors/user";

export default class UserController {
  static async incrementByOne(
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

      const res = await user.value.value.incrementPoints(1);

      if (res.ok === false) {
        throw res.error;
      }

      return {
        status: 200,
        body: JSON.stringify("Successfully incremented user points"),
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
}
