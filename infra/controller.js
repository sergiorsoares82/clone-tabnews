const { MethodNotAllowedError, InternalServerError } = require("./errors");

function onNoMatchHandler(req, res) {
  const publicObjectError = new MethodNotAllowedError();
  res.status(405).json(publicObjectError);
}

function onErrorHandler(err, req, res) {
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
