const {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} = require("./errors");

function onNoMatchHandler(req, res) {
  const publicObjectError = new MethodNotAllowedError();
  res.status(405).json(publicObjectError);
}

function onErrorHandler(err, req, res) {
  if (
    err instanceof ValidationError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError
  ) {
    return res.status(err.statusCode).json(err);
  }

  const publicObjectError = new InternalServerError({
    cause: err,
  });

  console.error(publicObjectError);

  res.status(publicObjectError.statusCode).json(publicObjectError);
}

const controller = {
  errorHandler: { onNoMatch: onNoMatchHandler, onError: onErrorHandler },
};

export default controller;
