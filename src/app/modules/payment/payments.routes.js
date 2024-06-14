const express = require("express");
const { tokenValidation } = require("../../utils/jsonwebtoken");
const {
  payNow,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getTransactionDetails,
} = require("./payment.controllers");
const route = express.Router();

route.post("/pay-now", tokenValidation, payNow);
route.post("/success", paymentSuccess);
route.post("/fail", paymentFail);
route.post("/cancel", paymentCancel);
route.get("/details", tokenValidation, getTransactionDetails);

module.exports = route;
