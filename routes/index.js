const router = require("express").Router();

const clothingItem = require("./clothingItem");

const { login, createUser } = require("../controllers/users");

const NotFoundError = require("../errors/notFoundError");

const {
  validateUserBody,
  validateUserAuthentication,
} = require("../middlewares/validation");

router.use("/items", clothingItem);

router.get(`/crash-rest`, () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserAuthentication, login);

router.use(() => {
  throw new NotFoundError("NotFoundError");
});

module.exports = router;
