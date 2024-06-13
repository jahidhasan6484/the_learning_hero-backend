const Course = require("./course.model");

const addNewCourse = async (req, res) => {
  try {
    const { title, description, instructor, fee, bannerURL } = req.body;
    const authorId = req._id;

    if (
      !title ||
      !description ||
      !instructor ||
      !fee ||
      !bannerURL ||
      !authorId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCourse = new Course({
      title,
      description,
      instructor,
      fee,
      bannerURL,
      authorId,
    });

    await newCourse.save();

    res.status(201).json({ message: "New course added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const myCourses = async (req, res) => {
  try {
    const userId = req._id;

    const userCourses = await Course.find({ authorId: userId });

    if (!userCourses || userCourses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this user" });
    }

    res.status(200).json({ data: userCourses });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMyCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const authorId = req._id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    if (!authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await Course.findOne({ _id: courseId, authorId });

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found or you are not authorized to delete this course",
      });
    }

    // Delete the course
    await Course.deleteOne({ _id: courseId });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const getACourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ data: course });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

const getACourseWithSuggestion = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const allCourses = await Course.find({ _id: { $ne: courseId } });

    const shuffled = allCourses.sort(() => 0.5 - Math.random());
    const suggestions = shuffled.slice(0, 4);

    res.status(200).json({ data: course, suggestions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

const updateACourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const authorId = req._id;
    const newData = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: courseId, authorId },
      newData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message:
          "Course not found or you are not authorized to update this course",
      });
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the course" });
  }
};

module.exports = {
  addNewCourse,
  myCourses,
  deleteMyCourse,
  getAllCourse,
  getACourse,
  updateACourse,
  getACourseWithSuggestion,
};
