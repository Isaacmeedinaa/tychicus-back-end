const mongoose = require("mongoose");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);

const fileSchema = new mongoose.Schema({
  url: { type: String, min: 1, required: true },
  publicId: { type: String, min: 1, required: true },
  fileType: { type: String, min: 1, required: true },
  type: { type: String, min: 1, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.post || this.comment ? false : true;
    },
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return this.user || this.comment ? false : true;
    },
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: function () {
      return this.user || this.post ? false : true;
    },
  },
});

const File = mongoose.model("File", fileSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const fileValidator = (file) => {
  const schema = Joi.object({
    url: Joi.string().min(1).required().messages({
      "string.base": "URL must be a string.",
      "string.empty": "URL cannot be empty.",
      "string.min": "URL should be at least 1 character long.",
    }),
    publicId: Joi.string().min(1).required().messages({
      "string.base": "Public ID must be a string.",
      "string.empty": "Public ID cannot be empty.",
      "string.min": "Public ID should be at least 1 character long.",
    }),
    fileType: Joi.string().min(1).required().messages({
      "string.base": "File type must be a string.",
      "string.empty": "File type cannot be empty.",
      "string.min": "File type should be at least 1 character long.",
    }),
    type: Joi.string().min(1).required().messages({
      "string.base": "Type must be a string.",
      "string.empty": "Type cannot be empty.",
      "string.min": "Type should be at least 1 character long.",
    }),
    user: Joi.objectId().messages({
      "any.required": "User is required.",
    }),
    post: Joi.objectId().messages({
      "any.required": "Post is required.",
    }),
    comment: Joi.objectId().messages({
      "any.required": "Comment is required.",
    }),
  }).options({ abortEarly: false });

  return schema.validate(file, joiObjOptions);
};

exports.fileSchema = fileSchema;
exports.File = File;
exports.fileValidator = fileValidator;
