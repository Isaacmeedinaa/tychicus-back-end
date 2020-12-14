const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  profileImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: false,
  },
  firstName: { type: String, min: 1, max: 50, required: true },
  lastName: { type: String, min: 1, max: 50, required: true },
  username: { type: String, min: 6, max: 50, required: true, unique: true },
  email: { type: String, min: 1, max: 255, required: true, unique: true },
  phoneNumber: { type: String, min: 11, max: 11, required: true, unique: true },
  location: { type: String, min: 8, max: 255, required: true },
  yearsInTheMinistry: { type: Number, min: 1, max: 60, required: true },
  password: { type: String, min: 6, max: 1024, required: true },
  titleInTheMinistry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Title",
    required: true,
  },
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  ],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
  ],
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Like", required: true },
  ],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

const User = mongoose.model("User", userSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const passwordComplexityOptions = {
  min: 6,
  max: 1024,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userValidator = (user) => {
  const schema = Joi.object({
    profileImage: Joi.objectId(),
    firstName: Joi.string().min(1).max(50).required().messages({
      "string.base": "First name should be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name should at least be 1 characters long.",
      "string.max": "First name should not be over 50 characters long.",
    }),
    lastName: Joi.string().min(1).max(50).required().messages({
      "string.base": "Last name should be a string.",
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name should at least be 1 characters long.",
      "string.max": "Last name should not be over 50 characters long.",
    }),
    username: Joi.string().alphanum().min(6).max(50).required().messages({
      "string.base": "Username should be a string.",
      "string.empty": "Username cannot be empty.",
      "string.min": "Username should at least be 6 characters long.",
      "string.max": "Username should not be over 50 characters long.",
      "string.alphanum": "Username must only contain alpha-numeric characters.",
    }),
    email: Joi.string().min(1).max(255).email().required().messages({
      "string.base": "Email should be a string.",
      "string.empty": "Email cannot be empty.",
      "string.min": "Email should at least be 3 characters long.",
      "string.max": "Email should not be over 50 characters long.",
      "string.email": "Email should be a valid email",
    }),
    phoneNumber: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "Phone number should be a string.",
        "string.empty": "Phone number cannot be empty.",
        "string.pattern.base": "Phone number should be a valid number.",
        "string.length": "Phone number should be 11 characters long.",
      }),
    location: Joi.string().min(8).max(255).required().messages({
      "string.base": "Location should be a string.",
      "string.empty": "Location cannot be empty.",
      "string.min": "Location should at least be 8 characters long.",
      "string.max": "Location should not be over 255 characters long.",
    }),
    yearsInTheMinistry: Joi.number().min(1).max(60).required().messages({
      "number.base": "Years in the ministry must be a valid number.",
      "number.min": "Years in the ministry should at least be 1 year.",
      "number.max": "Years in the ministry should not be over 60 years.",
      "any.required": "Years in the minsitry is required.",
    }),
    password: passwordComplexity.default(passwordComplexityOptions),
    titleInTheMinistry: Joi.objectId().required().messages({
      "any.required": "Title in the minsitry is required.",
    }),
    posts: Joi.array().items({ post: Joi.objectId().required() }),
    comments: Joi.array().items({ comment: Joi.objectId().required() }),
    likes: Joi.array().items({ like: Joi.objectId().required() }),
  }).options({ abortEarly: false });

  return schema.validate(user, joiObjOptions);
};

exports.userSchema = userSchema;
exports.User = User;
exports.userValidator = userValidator;
