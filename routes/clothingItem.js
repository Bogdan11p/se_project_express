const router = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate } = require("celebrate");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,

  dislikeItem,
} = require("../controllers/clothingItem");

const {
  validateCardBody,
  validateUserAndItemsIds,
} = require("../middlewares/validation");

router.post("/", auth, createItem);
router.get("/", getItems);
router.put(
  "/:itemId/likes",
  auth,

  likeItem
);

router.delete("/:itemId", auth, deleteItem);
router.delete(
  "/:itemId/likes",
  auth,

  dislikeItem
);

module.exports = router;
