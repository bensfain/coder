function sendResponse(res, code, data = null, message = '', errors = []) {
    const response = {
        status: code >= 200 && code < 300 ? 'success' : 'error',
        code,
        message
    };

    if (data) response.data = data;
    if (errors.length > 0) response.errors = errors;

    res.status(code).json(response);
}

module.exports = { sendResponse };