const ClothingItem = require("../models/clothingItem");
const { itemError, ERROR_403 } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
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
          .send({ message: "An error has occured on the server" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => itemError(req, res, e));
};

const deleteItem = (req, res) => {
  const itemId = req.params;
  const userId = req.user._id;
  console.log(itemId);
  console.log(userId);

  ClothingItem.findOne(itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      if (item.owner.equals(userId)) {
        return item.remove(() => res.send({ item }));
      }

      return res
        .status(ERROR_403)
        .send({ message: "Not Authorized to delete" });
    })
    .catch((e) => itemError(req, res, e));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((x) => res.send({ data: x }))
    .catch((e) => itemError(req, res, e));
};

function dislikeItem(req, res) {
  console.log(req.body);
  ClothingItem.findByIdAndUpdate(
    req.body._id,

    { $pull: { likes: req.body.user._id } },
    { new: true }
  )
    .orFail()
    .then((x) => res.send({ data: x }))
    .catch((e) => itemError(req, res, e));
}

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
