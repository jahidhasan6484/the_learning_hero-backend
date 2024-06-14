const Payment = require("../payment/payment.model");
const Course = require("./course.model");

const addNewCourse = async (req, res) => {
  try {
    const { title, description, instructor, fee, bannerURL, videoURL } =
      req.body;
    const authorId = req._id;

    if (
      !title ||
      !description ||
      !instructor ||
      !fee ||
      !bannerURL ||
      !videoURL ||
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
      videoURL,
      authorId,
    });

    await newCourse.save();

    res.status(201).json({ message: "New course added successfully" });
  } catch (error) {
    if (error.message.includes(`The value of "offset" is out of range`)) {
      return res.status(500).json({ message: "Too large files" });
    }
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

    // Count the number of paid enrollments for this course
    const enrollmentCount = await Payment.countDocuments({
      courseId,
      paid: true,
    });

    // Include enrollments in the course data
    const courseData = {
      ...course.toObject(),
      enrollments: enrollmentCount,
    };

    res.status(200).json({ data: courseData });
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
    if (error.message.includes(`The value of "offset" is out of range`)) {
      return res.status(500).json({ message: "Too large files" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all paid payments for the user
    const payments = await Payment.find({ userId, paid: true });

    if (!payments.length) {
      return res.status(404).json({ message: "No enrolled courses found" });
    }

    // Extract the course IDs from the payments
    const courseIds = payments.map((payment) => payment.courseId);

    const enrolledCourses = await Course.find({ _id: { $in: courseIds } });

    res.status(200).json({ data: enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrolled courses" });
  }
};

const paymentHistory = async (req, res) => {
  try {
    const userId = req._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all paid payments for the user
    const payments = await Payment.find({ userId, paid: true });

    if (!payments.length) {
      return res.status(404).json({ message: "No enrolled courses found" });
    }

    // Extract course IDs from payments
    const courseIds = payments.map((payment) => payment.courseId);

    // Fetch course titles
    const courses = await Course.find({ _id: { $in: courseIds } }, "title");

    const courseTitleMap = {};
    courses.forEach((course) => {
      courseTitleMap[course._id.toString()] = course.title;
    });

    const paymentData = payments.map((payment) => ({
      ...payment.toObject(),
      title: courseTitleMap[payment.courseId.toString()],
    }));

    res.status(200).json({ data: paymentData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

const haveAccess = async (req, res) => {
  try {
    const userId = req._id;
    const { courseId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if the user has paid for the course
    const payment = await Payment.findOne({ userId, courseId, paid: true });

    if (payment) {
      return res.status(200).json({ access: true });
    } else {
      return res
        .status(403)
        .json({ access: false, message: "Purchase course to play video" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to check access" });
  }
};

module.exports = {
  addNewCourse,
  myCourses,
  deleteMyCourse,
  getAllCourse,
  getACourse,
  updateACourse,
  getMyEnrolledCourses,
  paymentHistory,
  haveAccess,
};
