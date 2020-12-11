const mongoose = require("mongoose");
const Joi = require("joi");

const titleSchema = new mongoose.Schema({
  name: { type: String, min: 1, max: 255, required: true },
});

const Title = mongoose.model("Title", titleSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const titleValidator = (title) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      "string.base": "Title name should be a string.",
      "string.empty": "Title name cannot be empty",
      "string.min": "Title name should at least be 1 characters long",
      "string.max": "Title name should not be over 255 characters long",
    }),
  }).options({ abortEarly: false });

  return schema.validate(title, joiObjOptions);
};

exports.titleSchema = titleSchema;
exports.Title = Title;
exports.titleValidator = titleValidator;
