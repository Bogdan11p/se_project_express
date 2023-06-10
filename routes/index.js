const router = require("express").Router();
const User = require("./users");

const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res.status(500).send({
    message:
      "There is NO API with the requested path, or the request was sent to a non-existent address",
  });
});

module.exports = router;
