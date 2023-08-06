const router = require("express").Router();

const { validateUserAvatar } = require("../middlewares/validation");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserAvatar, updateCurrentUser);

module.exports = router;
