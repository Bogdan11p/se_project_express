const router = require("express").Router();

const {
  // getUser,
  // getUsers,
  // createUser
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
const { authorization } = require("../middlewares/auth");

//router.post("/", createUser);
//router.get("/", getUsers);
//router.get("/:userId", getUser);
router.get("/me", authorization, getCurrentUser);
router.patch("/me", authorization, updateCurrentUser);

module.exports = router;
