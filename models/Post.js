const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const postSchema = new mongoose.Schema(
  {
    text: { type: String, min: 1, required: true },
    files: [
      { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    ],
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Like", required: true },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const postValidator = (post) => {
  const schema = Joi.object({
    text: Joi.string().min(1).required().messages({
      "string.base": "Post text must be a string.",
      "string.empty": "Post cannot be empty.",
      "string.min": "Post should be at least 1 character long.",
    }),
    files: Joi.array().items({ file: Joi.objectId().required() }),
    user: Joi.objectId().required().messages({
      "any.required": "User is required.",
    }),
    comments: Joi.array().items({ comment: Joi.objectId().required() }),
    likes: Joi.array().items({ like: Joi.objectId().required() }),
  }).options({ abortEarly: false });

  return schema.validate(post, joiObjOptions);
};

exports.postSchema = postSchema;
exports.Post = Post;
exports.postValidator = postValidator;
