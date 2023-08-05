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

router.post("/", validateCardBody, auth, createItem);
router.get("/", getItems);
router.put(
  "/:itemId/likes",
  validateUserAndItemsIds,
  auth,

  likeItem
);

router.delete("/:itemId", validateUserAndItemsIds, auth, deleteItem);
router.delete(
  "/:itemId/likes",
  validateUserAndItemsIds,
  auth,

  dislikeItem
);

module.exports = router;
