const router = require("express").Router();

const {
  //getUsers,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);
//router.get("/", getUsers);

module.exports = router;
