/**
 * Main application entry point
 * @module app
 */

const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const { port } = require("./config");

/**
 * Express application instance
 * @type {Object}
 */
const app = express();

// Parsing JSON dari body request
app.use(bodyParser.json());
// Parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Menggunakan routing
app.use("/api/auth", authRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server Berjalan pada http://localhost:${port}`);
});
