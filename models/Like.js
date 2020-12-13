const mongoose = require("mongoose");
const Joi = require("Joi");
Joi.objectId = require("joi-objectid")(Joi);

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return this.comment ? false : true;
    },
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: function () {
      return this.post ? false : true;
    },
  },
});

const Like = mongoose.model("Like", likeSchema);

const joiObjOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const likeValidator = (like) => {
  const schema = Joi.object({
    user: Joi.objectId(),
    post: Joi.objectId(),
    comment: Joi.objectId(),
  }).options({ abortEarly: false });

  return schema.validate(like, joiObjOptions);
};

exports.likeSchema = likeSchema;
exports.Like = Like;
exports.likeValidator = likeValidator;
