const pool = require('../config/database');

class ResearchLog {
    static async findByProjectId(projectId, { startDate, endDate, activityType, userId, page = 1, limit = 20 }) {
        const offset = (page - 1) * limit;
        let query = `SELECT rl.*, u.username 
                FROM research_logs rl
                JOIN users u ON rl.user_id = u.id
                WHERE rl.project_id = ?`;
        const params = [projectId];

        if (startDate) {
            query += ` AND rl.log_date >= ?`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND rl.log_date <= ?`;
            params.push(endDate);
        }
        if (activityType) {
            query += ` AND rl.activity_type = ?`;
            params.push(activityType);
        }
        if (userId) {
            query += ` AND rl.user_id = ?`;
            params.push(userId);
        }

        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [logs] = await pool.query(query, params);

        // Get summary data
        const [summary] = await pool.query(
            `SELECT 
        SUM(hours_spent) as total_hours,
        activity_type,
        SUM(hours_spent) as type_hours
       FROM research_logs
       WHERE project_id = ?
       GROUP BY activity_type`, [projectId]
        );

        // Get total count
        const [total] = await pool.query(
            `SELECT COUNT(*) as count FROM research_logs WHERE project_id = ?`, [projectId]
        );

        return {
            logs,
            summary: {
                total_hours: summary.reduce((acc, curr) => acc + curr.type_hours, 0),
                activity_breakdown: summary.reduce((acc, curr) => {
                    acc[curr.activity_type] = curr.type_hours;
                    return acc;
                }, {})
            },
            pagination: {
                total: total[0].count,
                pages: Math.ceil(total[0].count / limit),
                current_page: page,
                limit
            }
        };
    }
}

module.exports = ResearchLog;