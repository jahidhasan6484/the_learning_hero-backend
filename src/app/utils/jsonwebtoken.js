const jwt = require("jsonwebtoken");

// Function to create a JWT
const createJWT = async (_id, email) => {
  const token = jwt.sign({ _id, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

// Middleware function to validate the JWT
const tokenValidation = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      message: "Authorization token is required",
    });
  }

  try {
    const tokenWithoutBearer = token.split(" ")[1];

    // Verify the token
    const decoded = await jwt.verify(
      tokenWithoutBearer,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attach user information to the request object
    req._id = decoded._id;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
      });
    }
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  return next();
};

module.exports = {
  createJWT,
  tokenValidation,
};
