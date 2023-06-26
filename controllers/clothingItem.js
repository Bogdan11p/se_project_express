const ClothingItem = require("../models/clothingItem");
const {
  handleOnFailError,
  handleErrorResponse,
  errorStatusCodes,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(200).json({ data: item });
    })
    .catch((err) => {
      console.error(err);
      handleErrorResponse(res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      handleErrorResponse(res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      handleErrorResponse(res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(handleOnFailError)
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(errorStatusCodes.forbidden)
          .send({ message: "Not authorized to delete this item" });
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.statusCode === errorStatusCodes.notFound) {
        res
          .status(errorStatusCodes.notFound)
          .send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res
          .status(errorStatusCodes.badRequest)
          .send({ message: "Bad request and/or invalid input" });
      } else {
        res
          .status(errorStatusCodes.internalServerError)
          .send({ message: "Something went wrong" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(handleOnFailError)
    .then(() =>
      res.status(200).send({ message: "Item has successfully been liked" })
    )
    .catch((err) => {
      handleErrorResponse(res, err);
    });
};

function dislikeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(handleErrorResponse)
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      handleErrorResponse(res, err);
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
