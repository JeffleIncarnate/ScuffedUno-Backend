import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./core/error/error-handler";

import { router as authSignIn } from "./routes/auth/signin";
import { router as authSignOut } from "./routes/auth/actions/signout";
import { router as authCallback } from "./routes/auth/callback";
import { router as me } from "./routes/auth/actions/me";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use("/api/auth/signin", authSignIn);
app.use("/api/auth/callback", authCallback);

app.use("/api/auth/actions/signout", authSignOut);
app.use("/api/auth/actions/me", me);

app.get("/", (req, res) => {
  res.sendStatus(200);
  return;
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
