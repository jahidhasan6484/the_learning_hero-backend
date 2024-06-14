const express = require("express");
const {
  addNewCourse,
  myCourses,
  deleteMyCourse,
  getAllCourse,
  getACourse,
  updateACourse,
  getMyEnrolledCourses,
  paymentHistory,
  haveAccess,
} = require("./course.controllers");
const { tokenValidation } = require("../../utils/jsonwebtoken");
const route = express.Router();

route.post("/add", tokenValidation, addNewCourse);
route.get("/my-courses", tokenValidation, myCourses);
route.delete("/delete", tokenValidation, deleteMyCourse);
route.get("/all", getAllCourse);
route.get("/one", getACourse);
route.patch("/update", tokenValidation, updateACourse);
route.get("/my-classroom", tokenValidation, getMyEnrolledCourses);
route.get("/payment-history", tokenValidation, paymentHistory);
route.get("/check-access", tokenValidation, haveAccess);

module.exports = route;
