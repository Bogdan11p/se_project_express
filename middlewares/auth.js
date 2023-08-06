const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require("../errors/unauthorizedError");
const ForbiddenError = require("../errors/forbiddenError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Unauthorized: Token expired");
    }
    if (err.name === "TokenExpiredError") {
      throw new UnauthorizedError("Unauthorized: Token expired");
    }
    throw new ForbiddenError("Forbidden Error");
  }

  req.user = payload;

  next();

  return null;
};

module.exports = auth;
