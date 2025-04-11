const db = require("../config/db");

exports.getProjectMembers = async(req, res) => {
    const { id } = req.params;

    try {
        const [projectRows] = await db.execute("SELECT id, title FROM research_projects WHERE id = ?", [id]);
        if (projectRows.length === 0) {
            return res.status(404).json({
                status: "error",
                code: 404,
                errors: [{ field: "projectId", message: "Proyek dengan ID tersebut tidak ditemukan" }],
                message: "Data tidak ditemukan"
            });
        }

        const [members] = await db.execute(`
      SELECT pm.id, u.id AS user_id, u.username, u.email, u.department, pm.role, pm.contribution_percentage, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `, [id]);

        res.json({
            status: "success",
            code: 200,
            data: {
                project: projectRows[0],
                members: members.map(member => ({
                    id: member.id,
                    user: {
                        id: member.user_id,
                        username: member.username,
                        email: member.email,
                        department: member.department
                    },
                    role: member.role,
                    contribution_percentage: parseFloat(member.contribution_percentage),
                    joined_at: member.joined_at
                }))
            },
            message: "Anggota proyek berhasil diambil"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", code: 500, message: "Server error" });
    }
};