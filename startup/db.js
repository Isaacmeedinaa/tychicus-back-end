const mongoose = require("mongoose");
require("dotenv").config();

const db = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to MongoDB 🚀!"))
    .catch((err) => console.log(err));
};

module.exports = db;
