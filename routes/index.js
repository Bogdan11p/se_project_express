const router = require("express").Router();
const User = require("./users");
const clothingItem = require("./clothingItem");
const { NOTFOUND_ERROR } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { celebrate } = require("celebrate");

const {
  validateUserBody,
  validateUserAuthentication,
} = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", auth, User);

router.get(`/crash-rest`, () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signup", celebrate(validateUserBody), createUser);
router.post("/signin", celebrate(validateUserAuthentication), login);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR.error).send({ message: "Router not found" });
});

module.exports = router;
