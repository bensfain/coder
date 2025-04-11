const pool = require('../config/database');

class ResearchProject {
    static async findAll({ status, confidentiality, page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM research_projects';
        const params = [];

        if (status || confidentiality) {
            query += ' WHERE';
            if (status) {
                query += ' status = ?';
                params.push(status);
            }
            if (status && confidentiality) {
                query += ' AND';
            }
            if (confidentiality) {
                query += ' confidentiality_level = ?';
                params.push(confidentiality);
            }
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [projects] = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM research_projects';
        if (status || confidentiality) {
            countQuery += ' WHERE';
            if (status) {
                countQuery += ' status = ?';
            }
            if (status && confidentiality) {
                countQuery += ' AND';
            }
            if (confidentiality) {
                countQuery += ' confidentiality_level = ?';
            }
        }

        const [total] = await pool.query(countQuery, params.slice(0, -2));
        const totalCount = total[0].total;

        return {
            projects,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                current_page: page,
                limit
            }
        };
    }

    static async create(projectData) {
        const { title, description, status, start_date, end_date, budget, confidentiality_level, lead_researcher_id } = projectData;
        const [result] = await pool.query(
            'INSERT INTO research_projects (title, description, status, start_date, end_date, budget, confidentiality_level, lead_researcher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [title, description, status, start_date, end_date, budget, confidentiality_level, lead_researcher_id]
        );
        return this.findById(result.insertId);
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM research_projects WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = ResearchProject;