const router = require("express").Router();

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
router.get("/:userId", getUser);
router.get("/me", auth.handleAuthError, getCurrentUser);
router.patch("/me", auth.handleAuthError, updateCurrentUser);
router.get("/", getUsers);

module.exports = router;
