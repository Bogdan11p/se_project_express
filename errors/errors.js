const BadRequestError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const UnauthorizedError = (message) => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

const ForbiddenError = (message) => {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
};

const NotFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const ConflictError = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
