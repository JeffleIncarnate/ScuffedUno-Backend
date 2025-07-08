import { z } from "zod";

export const validateToken = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  expiry_date: z.number(),
});

export const validateUser = z.object({
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
  email: z.string().email(),
  email_verified: z.boolean(),
});

export const validateCookies = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const validateAccessToken = z.object({
  id: z.string().cuid(),
  iat: z.number(),
  exp: z.number(),
});

export const validateRefreshToken = z.object({
  id: z.string().cuid(),
  iat: z.number(),
  exp: z.number(),
});
