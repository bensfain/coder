/**
 * User model module
 * @module models/user
 */

const bcrypt = require("bcryptjs");

/**
 * In-memory user database
 * @type {Array<Object>}
 */
let users = [
  {
    id: 1,
    username: "testuser",
    password: bcrypt.hashSync("password", 10), //
    //Enkripsi password
  },
];

console.log("Available users:", users);

module.exports = {
  /**
   * Find a user by username
   * @param {string} username - The username to search for
   * @returns {Object|undefined} Found user or undefined
   */
  findByUsername: (username) => {
    return users.find((user) => user.username === username);
  },

  /**
   * Find a user by ID
   * @param {number} id - The user ID to search for
   * @returns {Object|undefined} Found user or undefined
   */
  findById: (id) => users.find((user) => user.id === id),
};
