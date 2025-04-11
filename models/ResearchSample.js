const pool = require('../config/database');

class ResearchSample {
    static async findByProjectId(projectId) {
        const [rows] = await pool.query(
            `SELECT rs.*, u.username 
       FROM research_samples rs 
       JOIN users u ON rs.uploaded_by = u.id 
       WHERE rs.project_id = ?`, [projectId]
        );
        return rows;
    }

    static async findById(projectId, sampleId) {
        const [rows] = await pool.query(
            `SELECT * FROM research_samples 
       WHERE id = ? AND project_id = ?`, [sampleId, projectId]
        );
        return rows[0];
    }

    static async deleteById(projectId, sampleId) {
        const [result] = await pool.query(
            `DELETE FROM research_samples 
       WHERE id = ? AND project_id = ?`, [sampleId, projectId]
        );
        return result.affectedRows > 0;
    }

    static async create(sampleData) {
        const { project_id, sample_name, file_path, duration_seconds, format, sampling_rate, channel_count, notes, uploaded_by } = sampleData;
        const [result] = await pool.query(
            `INSERT INTO research_samples 
       (project_id, sample_name, file_path, duration_seconds, format, sampling_rate, channel_count, notes, uploaded_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [project_id, sample_name, file_path, duration_seconds, format, sampling_rate, channel_count, notes, uploaded_by]
        );
        return this.findById(project_id, result.insertId);
    }
    static async findByProjectId(projectId) {
        const [rows] = await pool.query(
            `SELECT rs.*, u.username 
           FROM research_samples rs
           JOIN users u ON rs.uploaded_by = u.id
           WHERE rs.project_id = ?`, [projectId]
        );
        return rows;
    }

    static async deleteById(projectId, sampleId) {
        const [result] = await pool.query(
            `DELETE FROM research_samples 
           WHERE id = ? AND project_id = ?`, [sampleId, projectId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ResearchSample;