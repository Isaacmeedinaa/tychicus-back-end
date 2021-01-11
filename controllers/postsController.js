const _ = require("lodash");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Post, postValidator } = require("../models/Post");
const { User, userValidator } = require("../models/User");
const { File, fileValidator } = require("../models/File");

const postsController = {
  getPosts: async (req, res) => {
    const posts = await Post.find()
      .populate("files", "-__v -post")
      .populate({
        path: "user",
        select: "-__v -posts -likes -comments",
        populate: { path: "profileImage", select: "-__v -user" },
      })
      .select("-__v");
    res.send(posts);
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("files", "-__v -post")
        .populate({
          path: "user",
          select: "-__v -posts -likes -comments",
          populate: { path: "profileImage", select: "-__v -user" },
        })
        .select("-__v");
      if (!post)
        return res.status(404).send({ message: "Post was not found!" });

      res.send(post);
    } catch {
      return res.status(404).send({ message: "Post was not found!" });
    }
  },
  createPost: async (req, res) => {
    const files = req.files;

    let user = await User.findById(req.body.user);
    if (!user) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fs.unlinkSync(`./${file.path}`);
      }
      return res.status(400).send({ message: "User was not found!" });
    }

    const { error } = postValidator(req.body);
    if (error) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fs.unlinkSync(`./${file.path}`);
      }
      const errorsArray = error.details.map((error) => error.message);
      return res.status(400).send({ validationErrors: errorsArray });
    }

    let post = new Post(_.pick(req.body, ["text", "user"]));

    post = await post.save();

    user.posts.push(post);

    await user.save();

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        let cloudinaryFileData;

        try {
          cloudinaryFileData = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
          });
        } catch {
          fs.unlinkSync(`./${file.path}`);
          return res
            .status(400)
            .send({ message: "An error occured while trying to upload file." });
        }

        let cloudinaryFileDataObj = {
          url: cloudinaryFileData.url,
          publicId: cloudinaryFileData.public_id,
          fileType: cloudinaryFileData.format,
          type: "Post Files",
          post: post._id.toString(),
        };

        const { error } = fileValidator(cloudinaryFileDataObj);
        if (error) {
          fs.unlinkSync(`./${file.path}`);
          await cloudinary.uploader.destroy(cloudinaryFileData.public_id);
          const errorsArray = error.details.map((error) => error.message);
          return res.status(400).send({ validationErrors: errorsArray });
        }

        let postFile = new File(cloudinaryFileDataObj);

        postFile = await postFile.save();

        console.log(postFile);

        post.files.push(postFile);

        await post.save();
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fs.unlinkSync(`./${file.path}`);
    }

    post = await Post.findById(post._id)
      .populate("files", "-__v -post")
      .populate({
        path: "user",
        select: "-__v -posts -likes -comments",
        populate: { path: "profileImage", select: "-__v -user" },
      })
      .select("-__v");

    res.send(post);
  },
  updatePost: async (req, res) => {},
  deletePost: async (req, res) => {},
};

module.exports = postsController;
