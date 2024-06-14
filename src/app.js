const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Set the body-parser limit to 10MB (adjust the size as needed)
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.json());
app.use(cors());

// Routes
const userRoutes = require("./app/modules/user/user.routes");
const courseRoutes = require("./app/modules/course/course.routes");
const paymentRoutes = require("./app/modules/payment/payments.routes");

app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);

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
