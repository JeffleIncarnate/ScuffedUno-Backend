import { HTTPError } from "./base_error";

export class InvalidUsername extends HTTPError {
   constructor() {
      super(400, {
         reason:
            "The username provided is not valid. Username can not contain spaces or special characters",
      });
   }
}

export class InvalidEmail extends HTTPError {
   constructor() {
      super(400, {
         reason: "The email provided is not valid",
      });
   }
}

export class InvalidPassword extends HTTPError {
   constructor() {
      super(400, {
         reason:
            "The Password provided is not valid. It must contain at least one of the following letters: Uppercase, lowercase, special character, number. And at least eight characters",
      });
   }
}

export class UsernameConflict extends HTTPError {
   constructor() {
      super(409, {
         reason: "A user with this username already exists",
      });
   }
}

export class UserNotFound extends HTTPError {
   constructor() {
      super(404, {
         reason:
            "You were not found within the database. So you were unable to be verified",
      });
   }
}

export class NodeEmailerL extends HTTPError {
   constructor() {
      super(500, {
         reason: "Unable to send email, please try again later",
      });
   }
}

export class JWTError extends HTTPError {
   constructor(reason: string) {
      super(500, {
         reason,
      });
   }
}
