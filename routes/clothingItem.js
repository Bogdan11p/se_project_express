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
router.put("/items/:itemId/likes", likeItem);
router.put("/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;
