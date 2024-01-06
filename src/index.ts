import "dotenv/config";
import http from "http";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";

import { logger } from "./core/logger/logger";
import { errorHandler } from "./core/errors/handler";

// Import Routes
// auth
import { login } from "./core/auth/authenticate";
import { refreshTokenRoute } from "./core/auth/refresh";

// post
import { verifyUser } from "./routes/user/create/verifyUser";
import { postUser } from "./routes/user/create/postUser";

// Server
const app = express();
app.use(
   cors({
      origin: "http://localhost:5173",
   }),
);
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
   cors: {
      origin: "*",
   },
});

// Express use declarations
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);

// Use Routes
// auth
app.use("/v1/api/auth/login", login);
app.use("/v1/api/auth/refresh", refreshTokenRoute);

// get

// post
app.use("/v1/api/user", postUser);
app.use("/v1/api/user/verify", verifyUser);

import { authorizeRequest } from "./core/auth/authorize";
app.get("/test", authorizeRequest, (req, res) => {
   return res.send({ detail: "hello world", user: req.user });
});
// Index Route
app.all("/", (req, res) => {
   return res.sendStatus(200);
});

app.all("*", (req, res) => {
   return res
      .status(404)
      .send({ errorCode: 404, detail: "This route does not exist" });
});

io.on("connection", (socket) => {
   socket.on("omg", (roomId) => {
      console.log(roomId);
   });
});

httpServer.listen(3000, () => {
   logger.info("API is running on port 3000");
});
