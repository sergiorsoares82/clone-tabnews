import session from "models/session";
import * as cookie from "cookie";

import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";

function onNoMatchHandler(req, res) {
  const publicObjectError = new MethodNotAllowedError();
  res.status(405).json(publicObjectError);
}

function onErrorHandler(err, req, res) {
  if (err instanceof ValidationError || err instanceof NotFoundError) {
    return res.status(err.statusCode).json(err);
  }

  if (err instanceof UnauthorizedError) {
    clearSessionCookie(res);
    return res.status(err.statusCode).json(err);
  }

  const publicObjectError = new InternalServerError({
    cause: err,
  });

  console.error(publicObjectError);

  res.status(publicObjectError.statusCode).json(publicObjectError);
}

async function setSessionCookie(res, sessionId) {
  const setCookie = cookie.serialize("session_id", sessionId, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  res.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

const controller = {
  errorHandler: { onNoMatch: onNoMatchHandler, onError: onErrorHandler },
  setSessionCookie,
  clearSessionCookie,
};

export default controller;
