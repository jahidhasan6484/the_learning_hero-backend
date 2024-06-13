const express = require("express");
const { tokenValidation } = require("../../utils/jsonwebtoken");
const {
  payNow,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} = require("./payment.controllers");
const route = express.Router();

route.post("/pay-now", tokenValidation, payNow);
route.post("/success", paymentSuccess);
route.post("/fail", paymentFail);
route.post("/cancel", paymentCancel);

module.exports = route;
