const { sendResponse } = require('../utils/response');

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(res, 403, null, 'Akses ditolak', [{
                field: 'authorization',
                message: 'Anda tidak memiliki izin untuk aksi ini'
            }]);
        }
        next();
    };
};