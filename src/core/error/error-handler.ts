import { Request, Response, NextFunction } from "express";

import { CustomError } from "./custom/error";

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(typeof err.code === "string" ? 500 : err.code).send({
      type: "CUSTOM ERROR",
      name: err.name,
      details: {
        message: err.message,
        code: err.code,
        stack: err.stack,
      },
    });
    return;
  }

  res.status(500).send({
    type: "REGULAR ERROR",
    name: err.name,
    details: {
      stack: err.stack,
    },
  });
  return;
};
