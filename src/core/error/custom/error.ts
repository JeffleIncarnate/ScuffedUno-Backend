export class CustomError {
  name: string;
  message: string;
  code: number | string;
  stack: string | undefined;

  constructor(
    name: string,
    message: string,
    code: number | string,
    stack: string | undefined
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.stack = stack;
  }
}
