import "dotenv/config";
import http from "http";

import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";

import { logger } from "./core/logger/logger";

// Import Routes
import { login } from "./core/auth/authenticate";
import { postUser } from "./routes/post/postUser";
import { verifyUser } from "./routes/post/verifyUser";
import { refreshTokenRoute } from "./core/auth/refresh";

// Server
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
   cors: {
      origin: "*",
   },
});

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Use Routes
// auth
app.use("/scuffed/auth/login", login);
app.use("/scuffed/auth/refresh", refreshTokenRoute);

// post
app.use("/scuffed/post/postUser", postUser);
app.use("/scuffed/post/verifyUser", verifyUser);

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
   console.log(socket);
});

httpServer.listen(3000, () => {
   logger.info("API is running on port 3000");
});
