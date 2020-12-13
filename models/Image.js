const mongoose = require("mongoose");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);

const imageSchema = new mongoose.Schema({
  url: { type: String, min: 1, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
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
    post: Joi.objectId().required().messages({
      "any.required": "Post is required.",
    }),
  }).options({ abortEarly: false });

  return schema.validate(image, joiObjOptions);
};

exports.imageSchema = imageSchema;
exports.Image = Image;
exports.imageValidator = imageValidator;
