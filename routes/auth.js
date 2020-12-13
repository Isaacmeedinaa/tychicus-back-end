const express = require("express");
const authController = require("../controllers/authController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = express.Router();

router.post("/login", authController.userLogin);
router.post("/auto-login", jwtMiddleware, authController.autoUserLogin);

module.exports = router;
