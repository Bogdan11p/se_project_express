const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  DEFAULT_ERROR,
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../errors/errors");

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new BadRequestError("Invalid data provided"));
      }

      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new BadRequestError("Invalid user ID"));
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!password) {
    next(new BadRequestError("Password is required"));
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) => {
      const userData = user.toObject();

      res.status(201).send({ data: userData });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else if (error.code === 11000) {
        next(new ConflictError("Email already exists in database"));
      }

      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log({ email, password });

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token, message: "The token is here" });
    })

    .catch((err) => {
      if (err.statusCode === 401) {
        res.status(401);
        next(new unauthorizedError("Email or Password not found"));
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "Internal server error" });
      }
    });
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
