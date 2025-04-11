const { ProjectMember } = require('../models');
const { sendResponse } = require('../utils/response');

exports.getProjectMembers = async(req, res) => {
    try {
        const members = await ProjectMember.findByProjectId(req.params.projectId);
        sendResponse(res, 200, { members }, 'Anggota proyek berhasil diambil');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};

exports.updateProjectMember = async(req, res) => {
    try {
        const { role, contribution_percentage } = req.body;
        const updatedMember = await ProjectMember.update(
            req.params.projectId,
            req.params.userId, { role, contribution_percentage }
        );
        sendResponse(res, 200, { member: updatedMember }, 'Informasi anggota proyek berhasil diperbarui');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};