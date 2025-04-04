const db = require('../config/db');

class User {
    static async findByUsername(username) {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0]; // Ambil user pertama (jika ada)
    }
}

module.exports = User;