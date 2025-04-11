const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { sendResponse } = require('../utils/response');
const jwtConfig = require('../config/jwt');

exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;

        console.log('[DEBUG] Input:', { username, password }); // Log input

        const user = await User.findByUsername(username);
        console.log('[DEBUG] User from DB:', user); // Log user dari database

        if (!user) {
            console.log('[DEBUG] User not found');
            return sendResponse(res, 401, null, 'User tidak ditemukan');
        }

        console.log('[DEBUG] Stored hash:', user.password);
        console.log('[DEBUG] Hash dari input:', await bcrypt.hash(password, 10)); // Bandingkan hash

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('[DEBUG] Password match:', isMatch); // Hasil compare

        if (!isMatch) {
            return sendResponse(res, 401, null, 'Password salah');
        }

        // ... kode token JWT ...
    } catch (error) {
        console.error('[ERROR] Login error:', error);
        sendResponse(res, 500, null, 'Server error');
    }
};