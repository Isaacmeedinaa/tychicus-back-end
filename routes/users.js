const express = require("express");
const multer = require("multer");
const userController = require("../controllers/usersController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
});
const usersController = require("../controllers/usersController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/register", usersController.registerUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  usersController.uploadProfileImage
);
router.delete("/delete-profile-image/:id", usersController.deleteProfileImage);

module.exports = router;
