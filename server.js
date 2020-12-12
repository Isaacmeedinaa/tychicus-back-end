const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

require("./startup/cloudinaryConfig")();
require("./startup/db")();

// Opens port for web server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listenining on port ${port} 🌎!`));
