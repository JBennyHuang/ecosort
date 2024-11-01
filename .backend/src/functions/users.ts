import UserController from "../controllers/user";
import { app } from "@azure/functions";

app.get("users-get-me", {
  route: "users/me",
  handler: UserController.getMe,
});

app.patch("users-increase-points", {
  route: "users/me/points",
  handler: UserController.increasePoints,
});
