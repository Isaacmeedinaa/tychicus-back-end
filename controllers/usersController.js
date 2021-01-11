const _ = require("lodash");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { User, userValidator } = require("../models/User");
const { File, fileValidator } = require("../models/File");

const userController = {
  getUsers: async (req, res) => {
    const users = await User.find()
      .populate("profileImage", "-__v -user")
      .populate("titleInTheMinistry", "-__v")
      .select("-__v -password -posts -comments -likes");
    res.send(users);
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("profileImage", "-__v -user")
        .populate("titleInTheMinistry", "-__v")
        .select("-__v -password -posts -comments -likes");

      if (!user) return res.status(404).send("User was not found!");

      res.send(user);
    } catch (err) {
      return res.status(404).send("User was not found!");
    }
  },
  registerUser: async (req, res) => {
    let user;
    const { error } = userValidator(req.body);

    if (error) {
      const errorsArray = error.details.map((error) => error.message);
      return res.status(400).send({ validationErrors: errorsArray });
    }

    user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send({ message: "Username is taken!" });

    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: "Email is taken!" });

    user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (user)
      return res.status(400).send({ message: "Phone number is taken!" });

    user = new User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "username",
        "email",
        "phoneNumber",
        "location",
        "yearsInTheMinistry",
        "titleInTheMinistry",
        "password",
      ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    user = await User.findById(user._id)
      .populate("titleInTheMinistry", "-__v")
      .select("-__v -password -posts -comments -likes");

    const token = user.generateAuthToken();

    const resObj = {
      user: user,
      token: token,
    };

    res.send(resObj);
  },
  updateUser: async (req, res) => {
    const { error } = userValidator(req.body);

    if (error) {
      const errorsArray = error.details.map((error) => error.message);
      return res.status(400).send({ validationErrors: errorsArray });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          profileImage: req.body.profileImage,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          location: req.body.location,
          yearsInTheMinistry: req.body.yearsInTheMinistry,
          titleInTheMinistry: req.body.titleInTheMinistry,
          // password: req.body.password,
        },
        { new: true }
      )
        .populate("profileImage", "-__v -user")
        .populate("titleInTheMinistry", "-__v")
        .select("-__v -password");

      if (!user)
        return res.status(404).send({ message: "User was not found!" });

      res.send(user);
    } catch {
      res.status(404).send({ message: "User was not found!" });
    }
  },
  deleteUser: async (req, res) => {
    let user;
    try {
      user = await User.findById(req.params.id).select(
        "-__v -password -posts -comments -likes"
      );

      if (!user) return res.status(404).send("User was not found!");

      await user.remove();

      if (user.profileImage) {
        let currentProfileImage = await Image.findById(user.profileImage);
        await cloudinary.uploader.destroy(currentProfileImage.publicId);
        await currentProfileImage.remove();
      }

      res.send(user);
    } catch {
      return res.status(404).send("User was not found!");
    }
  },
  uploadProfileImage: async (req, res) => {
    const file = req.file;
    let cloudinaryImageData;

    let user = await User.findById(req.body.user);
    if (!user) return res.status(400).send({ message: "User was not found!" });

    try {
      cloudinaryImageData = await cloudinary.uploader.upload(file.path);
    } catch (err) {
      return res
        .status(400)
        .send({ message: "An error occured while trying to upload image." });
    }

    const cloudinaryImageDataObj = {
      url: cloudinaryImageData.url,
      publicId: cloudinaryImageData.public_id,
      fileType: cloudinaryImageData.format,
      type: "Profile Image",
      user: req.body.user,
    };

    const { error } = fileValidator(cloudinaryImageDataObj);

    if (error) {
      await cloudinary.uploader.destroy(cloudinaryImageData.public_id);
      const errorsArray = error.details.map((error) => error.message);
      return res.status(400).send(errorsArray);
    }

    if (user.profileImage) {
      let currentProfileImage = await File.findById(user.profileImage);
      await cloudinary.uploader.destroy(currentProfileImage.publicId);
      await currentProfileImage.remove();
    }

    let profileImage = new File(cloudinaryImageDataObj);

    profileImage = await profileImage.save();

    user.profileImage = profileImage._id;

    user = await user.save();

    fs.unlinkSync(`./${file.path}`);

    profileImage = await File.find(profileImage._id).select("-__v -user");

    res.send(profileImage);
  },
  deleteProfileImage: async (req, res) => {
    let profileImage;
    try {
      profileImage = await File.findById(req.params.id).select("-__v");

      if (!profileImage)
        return res.status(404).send("Profile image was not found!");

      await profileImage.remove();

      await cloudinary.uploader.destroy(profileImage.publicId);
    } catch {
      return res.status(404).send("Profile image was not found!");
    }

    try {
      let user = await User.findById(profileImage.user);

      if (!user) return res.status(404).send("User image was not found!");

      user.profileImage = undefined;

      await user.save();

      res.send(profileImage);
    } catch {
      return res.status(404).send("User was not found!");
    }
  },
};

module.exports = userController;
