const { createJWT } = require("../../utils/jsonwebtoken");
const User = require("./user.model");

const registerUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validate email and name
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      const { _id, email } = isUserExist;
      const token = await createJWT(_id, email);

      return res.status(200).json({
        token,
        message: "Login successful",
      });
    }

    const newUser = new User({ email, name });
    await newUser.save();

    const token = await createJWT(newUser._id, newUser.email);

    res.status(201).json({
      token,
      message: "Regster & login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const { _id } = user;
    const token = await createJWT(_id, email);

    return res.status(200).json({
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
