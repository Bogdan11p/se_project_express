const User = require("../models/user");
const { regularUserError, findByIdUserError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      regularUserError(req, res, err);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  console.log(req.params);
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      findByIdUserError(req, res, err);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      regularUserError(req, res, err);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
};
