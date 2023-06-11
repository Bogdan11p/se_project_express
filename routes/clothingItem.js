const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  updateItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId/likes", likeItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
