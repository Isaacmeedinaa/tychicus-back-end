const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token was provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).send({ message: "Invalid token." });
  }
};

module.exports = jwtMiddleware;
