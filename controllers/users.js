const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  DEFAULT_ERROR,
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");
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
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, avatar }))
    .then((user) => {
      const userData = user.toObject();
      /* delete userData.password; */
      res.status(201).send({ data: userData });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else if (error.code === 11000) {
        res
          .status(CONFLICT_ERROR.error)
          .send({ message: "Email already exists in database" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
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

    .catch((error) => {
      console.error(error);
      res
        .status(UNAUTHORIZED_ERROR.error)
        .send({ message: "Email or Password not found" });
    });
};

/* const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => {
      console.error(error);
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
}; */

/* const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
}; */

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
};
