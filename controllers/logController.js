const { ResearchLog } = require('../models');
const { sendResponse } = require('../utils/response');

exports.getProjectLogs = async(req, res) => {
    try {
        const {
            startDate,
            endDate,
            activityType,
            userId,
            page = 1,
            limit = 20
        } = req.query;

        const logs = await ResearchLog.findByProjectId(req.params.projectId, {
            startDate,
            endDate,
            activityType,
            userId,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        sendResponse(res, 200, logs, 'Log aktivitas penelitian berhasil diambil');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};