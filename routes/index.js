const router = require("express").Router();
const User = require("./users");
const clothingItem = require("./clothingItem");
const { NOTFOUND_ERROR } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", auth.handleAuthError, User);

router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR.error).send({ message: "Router not found" });
});

module.exports = router;
