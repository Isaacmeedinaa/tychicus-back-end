const express = require("express");
const multer = require("multer");
const usersController = require("../controllers/usersController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profileImages");
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

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/register", usersController.registerUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  usersController.uploadProfileImage
);
router.delete("/delete-profile-image/:id", usersController.deleteProfileImage);

module.exports = router;
