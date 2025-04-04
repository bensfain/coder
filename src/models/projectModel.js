const db = require('../config/db');

class Project {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM research_projects"); // Sesuaikan nama tabel
        return rows;
    }


    static async getById(id) {
        const [rows] = await db.query(
            `SELECT id, title, description, status, start_date, end_date, budget, 
                        confidentiality_level, lead_researcher_id, created_at 
                 FROM research_projects WHERE id = ?`, [id]
        );
        return rows[0];
    }

    static async create(data) {
        const { title, description, status, start_date, end_date, budget, confidentiality_level, team_members } = data;
        const leadResearcherId = 1; // Set default ke 1

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert proyek
            const [result] = await connection.query(
                `INSERT INTO research_projects 
                    (title, description, status, start_date, end_date, budget, confidentiality_level, lead_researcher_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [title, description, status, start_date, end_date, budget, confidentiality_level, leadResearcherId]
            );

            const projectId = result.insertId;

            // Insert anggota tim jika ada
            if (team_members && team_members.length > 0) {
                for (const member of team_members) {
                    await connection.query(
                        "INSERT INTO project_members (project_id, user_id, role, contribution_percentage) VALUES (?, ?, ?, ?)", [projectId, member.user_id, member.role, member.contribution_percentage]
                    );
                }
            }

            await connection.commit();
            return projectId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }


    static async update(id, data) {
        const { role, contribution_percentage } = data;
        await db.query(
            "UPDATE project_members SET role = ?, contribution_percentage = ? WHERE id = ?", [role, contribution_percentage, id]
        );
    }

    static async delete(id) {
        await db.query("DELETE FROM research_projects WHERE id = ?", [id]);
    }
}

module.exports = Project;