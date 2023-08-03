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

router.post("/", auth, celebrate(validateCardBody), createItem);
router.get("/", getItems);
router.put(
  "/:itemId/likes",
  auth,
  celebrate(validateUserAndItemsIds),
  likeItem
);

router.delete("/:itemId", auth, celebrate(validateUserAndItemsIds), deleteItem);
router.delete(
  "/:itemId/likes",
  auth,
  celebrate(validateUserAndItemsIds),
  dislikeItem
);

module.exports = router;
