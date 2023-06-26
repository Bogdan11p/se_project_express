const router = require("express").Router();
const User = require("./users");
const { errorStatusCodes } = require("../utils/errors");

const clothingItem = require("./clothingItem");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res.status(errorStatusCodes.notFpund).send({
    message:
      "There is NO API with the requested path, or the request was sent to a non-existent address",
  });
});

module.exports = router;
