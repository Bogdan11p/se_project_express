const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((error) => {
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("item not found"));
      }

      if (!item.owner.equals(userId)) {
        next(
          new ForbiddenError("Unauthorized: Only the card owner can delete it")
        );
      }

      return ClothingItem.deleteOne({ _id: itemId, owner: userId })
        .then(() => {
          res.status(200).send({ message: "Item deleted successfully" });
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      }

      return next(error);
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
        next(new NotFoundError("Item not found"));
      } else {
        res.status(200).send({ data: x });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
      }
    });
};

function dislikeItem(req, res, next) {
  console.log(req.user);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,

    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((x) => {
      if (!x) {
        next(new NotFoundError("Item not found"));
      } else {
        res.status(200).send({ data: x });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(error);
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
