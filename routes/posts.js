const express = require("express");
const multer = require("multer");
const postsController = require("../controllers/postsController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/postFiles");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
});
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = express.Router();

router.get("/", postsController.getPosts);
router.get("/:id", postsController.getPost);
router.post("/", upload.array("multipleFiles", 10), postsController.createPost);
router.put("/:id", postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;
