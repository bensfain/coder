const { ResearchProject } = require('../models');
const { sendResponse } = require('../utils/response');

exports.getAllProjects = async(req, res) => {
    try {
        const { status, confidentiality, page = 1, limit = 10 } = req.query;
        const projects = await ResearchProject.findAll({
            status,
            confidentiality,
            page: parseInt(page),
            limit: parseInt(limit)
        });
        sendResponse(res, 200, projects, 'Proyek penelitian berhasil diambil');
    } catch (error) {
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};

exports.createProject = async(req, res) => {
    try {
        const projectData = {
            ...req.body,
            lead_researcher_id: req.user.id
        };
        const project = await ResearchProject.create(projectData);
        sendResponse(res, 201, { project }, 'Proyek penelitian berhasil dibuat');
    } catch (error) {
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};

exports.getProjectById = async(req, res) => {
    try {
        const project = await ResearchProject.findById(req.params.projectId);
        if (!project) {
            return sendResponse(res, 404, null, 'Proyek tidak ditemukan');
        }
        sendResponse(res, 200, { project }, 'Detail proyek berhasil diambil');
    } catch (error) {
        sendResponse(res, 500, null, 'Terjadi kesalahan server');
    }
};