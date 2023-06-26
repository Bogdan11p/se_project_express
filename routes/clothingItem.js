const router = require("express").Router();
const { authorization } = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  updateItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", authorization, createItem);
router.get("/", getItems);
router.put("/:itemId/likes", authorization, likeItem);
router.put("/:itemId", authorization, updateItem);
router.delete("/:itemId", authorization, deleteItem);
router.delete("/:itemId/likes", authorization, dislikeItem);

module.exports = router;
