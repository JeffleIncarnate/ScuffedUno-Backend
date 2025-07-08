import jwt from "jsonwebtoken";

export const createAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "3h",
  });
};

export const createRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const decryptAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const decryptRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};
