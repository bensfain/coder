/**
 * Authentication routes module
 * @module routes/auth
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, jwtExpiresIn } = require("../config");
const { findByUsername, findById } = require("../models/user");
const router = express.Router();

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object containing id
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

/**
 * Login route handler
 * Authenticates user and returns JWT token
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = findByUsername(username);

  if (!user) {
    return res.status(400).json({ message: "User not Found" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = generateToken(user);
  return res.json({ message: "Login Successful", token });
});

/**
 * JWT Authentication middleware
 * Verifies the JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = findById(decoded.id); // simpan data pengguna ke request
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }
};

/**
 * Protected route that requires authentication
 * Returns user data from the authenticated request
 */
router.get("/protected", authenticateJWT, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
  });
});

module.exports = router;
