// models/User.js
const pool = require('../config/database');

class User {
    static async findByUsername(username) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE username = ?', [username]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in findByUsername:', error);
            throw error;
        }
    }

    // ... method lainnya ...
}

module.exports = User;