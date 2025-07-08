import express from "express";
import cookieParser from "cookie-parser";

const router = express.Router();

router.get("/", cookieParser(), (req, res) => {
  console.log(req.cookies);

  res.send("e");
  return;
});

export { router };
