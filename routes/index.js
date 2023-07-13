const router = require("express").Router();
const User = require("./users");
const clothingItem = require("./clothingItem");
const { ERROR_404 } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", User);

router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res, error) => {
  res.status(ERROR_404).send({ message: "Router not found" });
});

module.exports = router;
