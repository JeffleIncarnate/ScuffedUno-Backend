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
