const ClothingItem = require("../models/clothingItem");
/* const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

function handleItemErrorCatch(res, err) {
  if (err.name === "ValidationError" || err.name === "AssertionError") {
    return res.status(ERROR_400).send({
      message:
        "invalid data passed to the methods for creating an item, or invalid ID passed to the params",
    });
  }
  if (err.name === "CastError") {
    return res.status(ERROR_400).send({
      message:
        "There is no clothing with the requested id, or the request was sent to a non-existent address.",
    });
  }
  return res.status(ERROR_500).send({
    message: "An error has occurred on the server.",
    err,
  });
}

function handleFindByIdItemError(req, res, err) {
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "AssertionError"
  ) {
    return res.status(ERROR_400).send({
      message:
        "invalid data passed to the methods for creating an item, or invalid ID passed to the params",
    });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(ERROR_404).send({
      message:
        "There is no clothing with the requested id, or the request was sent to a non-existent address.",
    });
  }
  return res
    .status(ERROR_500)
    .send({ message: "An error has occurred on the server.", err });
}
 */
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      handleRegularItemError(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.param;
  const { imageUrl } = req.body;

  ClothingItem.findOneAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      handleItemErrorCatch(req, res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res
        .status(200)
        .send({ message: `The item has been successfully deleted.` })
    )
    .catch((err) => {
      handleFindByIdItemError(req, res, err);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() =>
      res.status(200).send({ message: "Item has successfully been liked" })
    )
    .catch((err) => {
      handleFindByIdItemError(req, res, err);
    });
};

function dislikeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      handleFindByIdItemError(req, res, err);
    });
}

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
