const _ = require("lodash");
const { Title, titleValidator } = require("../models/Title");

const titlesController = {
  getTitles: async (req, res) => {
    const titles = await Title.find().select("-__v");
    res.send(titles);
  },
  createTitle: async (req, res) => {
    const { error } = titleValidator(req.body);

    if (error) {
      const errorsArray = error.details.map((error) => error.message);
      return res.status(400).send(errorsArray);
    }

    let title = new Title(_.pick(req.body, ["name"]));

    title = await title.save();

    title = await Title.findById(title._id).select("-__v");

    res.send(title);
  },
};

module.exports = titlesController;
