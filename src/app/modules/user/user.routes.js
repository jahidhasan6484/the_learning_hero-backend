const { registerUser, loginUser } = require("./user.controllers");

const express = require("express");
const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);

module.exports = route;
