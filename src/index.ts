import "dotenv/config";
import http from "http";

import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";

import { logger } from "./core/logger/logger";

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

// Import Routes
import { postUser } from "./routes/post/postUser";
import { verifyUser } from "./routes/post/verifyUser";

// Use Routes
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
