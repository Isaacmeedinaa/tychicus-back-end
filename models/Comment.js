const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, min: 1, required: true },
    imgUrl: { type: String, min: 1, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Like", required: true },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const commentValidator = (comment) => {
  const schema = Joi.object({
    text: Joi.string().min(1).required().messages({
      "string.base": "Post text must be a string.",
      "string.empty": "Post cannot be empty.",
      "string.min": "Post should be at least 1 character long.",
    }),
    imgUrl: Joi.string().min(1).messages({
      "string.base": "Image URL must be a string.",
      "string.empty": "Image URL cannot be empty.",
      "string.min": "Image URL should be at least 1 character long.",
    }),
    user: Joi.objectId().required().messages({
      "any.required": "User is required.",
    }),
    post: Joi.objectId().required().messages({
      "any.required": "Post is required.",
    }),
    likes: Joi.array().items({ like: Joi.objectId().required() }),
  }).options({ abortEarly: false });

  return schema.validate(comment, joiObjOptions);
};

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.commentValidator = commentValidator;
