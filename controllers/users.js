const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { itemError, ERROR_409, ERROR_401 } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      }

      res.send({ data: user });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((e) => itemError(req, res, e));
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) => {
      const userData = user.toObject();

      res.status(201).send({ data: userData });
    })
    .catch((error) => itemError(req, res, error));
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token, message: "The token is here" });
    })

    .catch((error) => itemError(req, res, error));
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
