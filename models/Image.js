const mongoose = require("mongoose");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);

const imageSchema = new mongoose.Schema({
  url: { type: String, min: 1, required: true },
  publicId: { type: String, min: 1, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.post ? false : true;
    },
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return this.user ? false : true;
    },
  },
});

const Image = mongoose.model("Image", imageSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const imageValidator = (image) => {
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
    user: Joi.objectId().messages({
      "any.required": "User is required.",
    }),
    post: Joi.objectId().messages({
      "any.required": "Post is required.",
    }),
  }).options({ abortEarly: false });

  return schema.validate(image, joiObjOptions);
};

exports.imageSchema = imageSchema;
exports.Image = Image;
exports.imageValidator = imageValidator;
