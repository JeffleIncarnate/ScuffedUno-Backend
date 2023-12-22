import { z } from "zod";

export const LoginRequest = z.object({
   username: z.string({
      required_error:
         "Username is required for authentication, Please provide it",
   }),
   password: z.string({
      required_error:
         "Password is required for authentication, Please provide it",
   }),
});

export const ScopesValidator = z.object({
   socket: z.object({
      canCreateRoom: z.boolean(),
      canJoinRoom: z.boolean(),
      canPlayCard: z.boolean(),
   }),
   self: z.object({
      canDeleteSelf: z.boolean(),
      canDeleteOthers: z.boolean(),
      canCreateUSer: z.boolean(),
   }),
});

export const AccessTokenValidator = z.object({
   uuid: z.string().uuid(),
   scopes: ScopesValidator,
   iat: z.number(),
   exp: z.number(),
});

export type AccessToken = z.infer<typeof AccessTokenValidator>;
