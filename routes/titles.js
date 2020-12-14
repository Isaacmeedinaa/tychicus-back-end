const express = require("express");
const titlesController = require("../controllers/titlesController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = express.Router();

router.get("/", titlesController.getTitles);
router.post("/", titlesController.createTitle);

module.exports = router;
