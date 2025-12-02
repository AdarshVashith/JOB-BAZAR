const { signupUser, loginUser, getUser } = require("../controllers/authController.js");
const { Router } = require("express");

const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.get("/user/:id", getUser)

module.exports = router;