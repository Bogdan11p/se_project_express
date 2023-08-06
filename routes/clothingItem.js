const router = require("express").Router();
const auth = require("../middlewares/auth");

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

router.post("/", auth, validateCardBody, createItem);
router.get("/", getItems);
router.put("/:itemId/likes", auth, validateUserAndItemsIds, likeItem);

router.delete("/:itemId", auth, validateUserAndItemsIds, deleteItem);
router.delete("/:itemId/likes", auth, validateUserAndItemsIds, dislikeItem);

module.exports = router;
