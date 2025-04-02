export class InternalServerError extends Error {
  constructor({ cause }) {
    console.log(cause);
    super("Um errro interno não esperado ocorreu.", { cause });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        action: this.action,
        status_code: this.statusCode,
      },
    };
  }
}
