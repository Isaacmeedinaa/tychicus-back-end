const express = require("express");

const auth = require("../routes/auth");

const routes = (app) => {
  app.use(express.json());

  app.use("/api/v1/auth", auth);
};

module.exports = routes;
