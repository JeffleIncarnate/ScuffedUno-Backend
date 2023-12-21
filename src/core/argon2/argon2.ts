import * as argon2 from "argon2";

/**
 * Async function to hash a password
 * @param password
 * @returns string
 */
async function hashPassword(password: string): Promise<string> {
   return await argon2.hash(password, {
      type: argon2.argon2id,
   });
}

async function verifyPasswordHash(
   hashPassword: string,
   password: string,
): Promise<boolean> {
   return await argon2.verify(hashPassword, password);
}

export { hashPassword, verifyPasswordHash };
