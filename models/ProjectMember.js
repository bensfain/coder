const pool = require('../config/database');

class ProjectMember {
    static async findByProjectId(projectId) {
        const [rows] = await pool.query(
            `SELECT pm.*, u.username, u.email, u.department 
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?`, [projectId]
        );
        return rows;
    }

    static async update(projectId, userId, { role, contribution_percentage }) {
        await pool.query(
            `UPDATE project_members 
       SET role = ?, contribution_percentage = ?, updated_at = CURRENT_TIMESTAMP
       WHERE project_id = ? AND user_id = ?`, [role, contribution_percentage, projectId, userId]
        );
        return this.findById(projectId, userId);
    }

    static async findById(projectId, userId) {
        const [rows] = await pool.query(
            `SELECT * FROM project_members 
       WHERE project_id = ? AND user_id = ?`, [projectId, userId]
        );
        return rows[0];
    }

    static async addMember(projectId, userId, { role, contribution_percentage }) {
        await pool.query(
            `INSERT INTO project_members 
       (project_id, user_id, role, contribution_percentage)
       VALUES (?, ?, ?, ?)`, [projectId, userId, role, contribution_percentage]
        );
        return this.findById(projectId, userId);
    }
}

module.exports = ProjectMember;