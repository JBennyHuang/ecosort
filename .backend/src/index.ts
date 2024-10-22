import { app } from "@azure/functions";
import { config } from "dotenv";

config();

app.setup({
  enableHttpStream: true,
});
