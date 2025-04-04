const Project = require('../models/projectModel');

exports.getAllProjects = async(req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async(req, res) => {
    try {
        const project = await Project.getById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project tidak ditemukan" });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async(req, res) => {
    try {
        const projectId = await Project.create(req.body);

        // Ambil kembali data proyek yang baru dibuat
        const newProject = await Project.getById(projectId);

        res.status(201).json({
            status: "success",
            code: 201,
            data: {
                project: newProject
            },
            message: "Proyek penelitian berhasil dibuat"
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateProject = async(req, res) => {
    try {
        await Project.update(req.params.id, req.body);
        res.json({ message: "Project telah di update !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProject = async(req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({ message: "Project telah dihapus !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};