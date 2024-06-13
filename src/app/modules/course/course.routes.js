const express = require("express");
const {
  addNewCourse,
  myCourses,
  deleteMyCourse,
  getAllCourse,
  getACourse,
  updateACourse,
  getACourseWithSuggestion,
} = require("./course.controllers");
const { tokenValidation } = require("../../utils/jsonwebtoken");
const route = express.Router();

route.post("/add", tokenValidation, addNewCourse);
route.get("/my-courses", tokenValidation, myCourses);
route.delete("/delete", tokenValidation, deleteMyCourse);
route.get("/all", getAllCourse);
route.get("/one", getACourse);
route.get("/one-with-suggestion", getACourseWithSuggestion);
route.patch("/update", tokenValidation, updateACourse);

module.exports = route;
