const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require("../errors/badRequestError");

const ConflictError = require("../errors/conflictError");
const UnauthorizedError = require("../errors/unauthorizedError");

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
        next(new BadRequestError("Invalid data provided"));
      }

      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      } else {
        next(error);
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
      res.status(201).send({ name, avatar, _id: user._id, email: user.email });
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token, message: "The token is here" });
    })

    .catch((error) => {
      if (error.message === "Incorrect email or password") {
        next(new UnauthorizedError("Email or Password not found"));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
