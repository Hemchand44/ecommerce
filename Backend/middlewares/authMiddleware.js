const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for Bearer Token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // 2. Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user and attach to request
      const user = await User.findById(decoded?.id).select("_id email role");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("JWT Auth Error:", err); // Add this for debugging
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
});



const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("Your are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
