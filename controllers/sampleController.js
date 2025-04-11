const { ResearchSample } = require('../models');
const { sendResponse } = require('../utils/response');

exports.getProjectSamples = async(req, res) => {
    try {
        const samples = await ResearchSample.findByProjectId(req.params.projectId);
        sendResponse(res, 200, { samples }, 'Sampel penelitian berhasil diambil');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};

exports.deleteSample = async(req, res) => {
    try {
        const deleted = await ResearchSample.deleteById(
            req.params.projectId,
            req.params.sampleId
        );

        if (!deleted) {
            return sendResponse(res, 404, null, 'Sampel tidak ditemukan');
        }

        sendResponse(res, 200, null, 'Sampel penelitian berhasil dihapus');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};