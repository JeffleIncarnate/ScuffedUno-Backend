import "dotenv/config";
import http from "http";

import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";

import { logger } from "./core/logger/logger";
import { createTokenCreateUser } from "./core/jwt/jwt";

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

app.get("/", (req, res) => {
  return res.send(createTokenCreateUser("e"));
});

io.on("connection", (socket) => {});

httpServer.listen(3000, () => {
  logger.info("API is running on port 3000");
});

sflhsdkfjhsdkjfh;
