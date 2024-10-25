import UserController from "../controllers/user";
import { app } from "@azure/functions";

// /users

app.get("users-get-me", {
  route: "users/me",
  handler: UserController.getMe,
});

app.patch("increment-user-points", {
  route: "users/increment",
  handler: UserController.incrementByOne,
});
