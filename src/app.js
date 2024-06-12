const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/public/uploads", express.static("public/uploads"));

// Routes

app.get("/", (req, res) => {
  try {
    res.send({
      message: "Welcome to The Learning Hero server",
    });
  } catch (error) {
    res.send({
      message: "Something went wrong",
    });
  }
});

module.exports = app;
