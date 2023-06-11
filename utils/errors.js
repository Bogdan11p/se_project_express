const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

const regularItemError = (req, res, err) => {
  if (err.name === "ValidationError") {
    return res.status(ERROR_400).send({
      message: "Invalid data passed for creating or updating an item.",
    });
  }
  if (err.name === "CastError") {
    return res.status(ERROR_400).send({
      message: "Invalid ID.",
    });
  }
  return res.status(ERROR_500).send({ message: "An error has occurred" });
};

const findByIdItemError = (req, res, err) => {
  if (err.name === "CastError" || err.name === "ValidationError") {
    return res.status(ERROR_400).send({
      message: "Invalid data passed for creating or updating an item.",
    });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(ERROR_404).send({
      message: "Invalid ID.",
    });
  }
  return res.status(ERROR_500).send({ message: "An error has occurred" });
};

const regularUserError = (req, res, err) => {
  if (err.name === "ValidationError") {
    return res.status(ERROR_400).send({
      message: "Invalid data passed for creating or updating a user.",
    });
  }
  if (err.name === "CastError") {
    return res.status(ERROR_400).send({
      message: "Invalid ID.",
    });
  }
  return res.status(ERROR_500).send({ message: "An error has occurred" });
};

const findByIdUserError = (req, res, err) => {
  if (err.name === "CastError" || err.name === "ValidationError") {
    return res.status(ERROR_400).send({
      message: "Invalid data passed for creating or updating a user.",
    });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(ERROR_404).send({
      message: "Invalid ID.",
    });
  }
  return res.status(ERROR_500).send({ message: "An error has occurred" });
};

module.exports = {
  regularItemError,
  regularUserError,
  findByIdItemError,
  findByIdUserError,
};
