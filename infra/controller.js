const {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
} = require("./errors");

function onNoMatchHandler(req, res) {
  const publicObjectError = new MethodNotAllowedError();
  res.status(405).json(publicObjectError);
}

function onErrorHandler(err, req, res) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  const publicObjectError = new InternalServerError({
    statusCode: err.statusCode,
    cause: err,
  });

  console.error(publicObjectError);

  res.status(publicObjectError.statusCode).json(publicObjectError);
}

const controller = {
  errorHandler: { onNoMatch: onNoMatchHandler, onError: onErrorHandler },
};

export default controller;
