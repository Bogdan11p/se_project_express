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

router.post("/", celebrate({ body: validateCardBody }), auth, createItem);
router.get("/", getItems);
router.put(
  "/:itemId/likes",
  celebrate({ body: validateUserAndItemsIds }),
  auth,

  likeItem
);

router.delete(
  "/:itemId",
  celebrate({ body: validateUserAndItemsIds }),
  auth,
  deleteItem
);
router.delete(
  "/:itemId/likes",
  celebrate({ body: validateUserAndItemsIds }),
  auth,

  dislikeItem
);

module.exports = router;
