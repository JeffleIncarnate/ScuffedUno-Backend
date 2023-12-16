/**
 * Checks for a valid username. If a username is valid it will return true, else false
 * @param username
 * @returns boolean
 */
function verifyUsername(username: string): boolean {
  const regex = new RegExp(/\s+|[!-/:-@[-`{-~]/g);

  if ([...username.matchAll(regex)].length !== 0) {
    return false;
  }

  return true;
}

/**
 * Checks for a valid email. If the email is valid it will return true, else false
 * @param email string
 * @returns boolean
 */
function verifyEmail(email: string): boolean {
  const regex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,7}$/g);

  if ([...email.matchAll(regex)].length === 0) {
    return false;
  }

  return true;
}

/**
 * Checks for a valid password. If the password if valid it will return true, else false
 * @param password string
 * @returns boolean
 */
function verifyPassword(password: string): boolean {
  /* 
    At least 1 capital letter
    At least 1 lower case letter
    At least 1 digit
    At least 1 special character
    Minimum length of 8 characters
    No spaces
  */
  const regex = new RegExp(
    /^(?!.*\s+)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g
  );

  if ([...password.matchAll(regex)].length === 0) {
    return false;
  }

  return true;
}

export { verifyUsername, verifyEmail, verifyPassword };
