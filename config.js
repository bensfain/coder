/**
 * Application configuration module
 * @module config
 */

require("dotenv").config(); // Memuat variabel dari file .env

/**
 * Configuration object
 * @type {Object}
 * @property {string} jwtSecret - Secret key for JWT signing
 * @property {string} jwtExpiresIn - JWT expiration time
 * @property {number} port - Server port number
 */
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  port: process.env.PORT || 3000,
};
