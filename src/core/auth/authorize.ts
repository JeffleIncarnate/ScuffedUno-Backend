import { Request, Response, NextFunction } from "express";

import { decryptAccessToken, decryptRefreshToken } from "../utils/jwt";
import { validateAccessToken, validateRefreshToken } from "../utils/validators";
import { CustomError } from "../error/custom/error";
import { JsonWebTokenError } from "jsonwebtoken";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    res.status(401).send({
      type: "REGULAR ERROR",
      name: "auth",
      details: {
        message: "cookies were undefined",
        code: 401,
      },
    });
    return;
  }

  const [accessToken, refreshToken] = cookie
    .split(";")
    .map((e) => e.split("=")[1]);

  // verify the tokens
  try {
    validateAccessToken.parse(decryptAccessToken(accessToken));
  } catch (err) {
    // it doesn't matter what the error is cause we'll send the same error anyways
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(401).send({
      type: "REGULAR ERROR",
      name: "auth",
      details: {
        message: "access token error",
        code: 401,
      },
    });
    return;
  }

  try {
    validateRefreshToken.parse(decryptRefreshToken(refreshToken));
  } catch (err) {
    // it doesn't matter what the error is cause we'll send the same error anyways
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(401).send({
      type: "REGULAR ERROR",
      name: "auth",
      details: {
        message: "refresh token error",
        code: 401,
      },
    });
    return;
  }

  next();
};
