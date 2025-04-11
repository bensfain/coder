const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');
const jwtConfig = require('../config/jwt');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return sendResponse(res, 401, null, 'Token tidak tersedia', [{
            field: 'auth',
            message: 'Token autentikasi diperlukan'
        }]);
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) {
            return sendResponse(res, 403, null, 'Token tidak valid', [{
                field: 'auth',
                message: 'Token autentikasi tidak valid atau kadaluarsa'
            }]);
        }

        req.user = user;
        next();
    });
};