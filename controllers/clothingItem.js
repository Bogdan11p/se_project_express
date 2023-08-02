const ClothingItem = require("../models/clothingItem");
const {
  DEFAULT_ERROR,
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../errors/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new badRequestError("Invalid data provided"));
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
    .catch(() => {
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
};

const deleteItem = (req, res, next) => {
  const itemId = req.params;
  const userId = req.user._id;

  ClothingItem.findOne(itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      if (item.owner.equals(userId)) {
        return item.remove(() => res.status(200).send({ item }));
      }

      return res
        .status(ERROR_403)
        .send({ message: "Not Authorized to delete" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new badRequestError("Invalid data provided"));
      }

      return res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((x) => {
      if (!x) {
        res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("Item not found"));
      } else {
        res.status(200).send({ data: x });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new badRequestError("Invalid data provided"));
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

function dislikeItem(req, res, next) {
  console.log(req.body);
  ClothingItem.findByIdAndUpdate(
    req.body._id,

    { $pull: { likes: req.body.user._id } },
    { new: true }
  )
    .orFail()
    .then((x) => {
      if (!x) {
        res.status(NOTFOUND_ERROR.error);
        next(new NotFoundError("Item not found"));
      } else {
        res.status(200).send({ data: x });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(INVALID_DATA_ERROR.error);
        next(new badRequestError("Invalid data provided"));
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
}

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
