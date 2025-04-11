const { Project, User, ProjectMember } = require('../models');
const db = require('../config/db');

exports.getAllProjects = async() => {
    const [rows] = await db.query('SELECT * FROM research_projects');
    return rows;
};

exports.getProjectById = async(projectId) => {
    const [rows] = await db.query(`
    SELECT p.*, u.username AS lead_username
    FROM research_projects p
    JOIN users u ON u.id = p.lead_researcher_id
    WHERE p.id = ?
  `, [projectId]);

    return rows[0]; // satu objek
};

// exports.getAllProjects = async() => {
//     return await Project.findAll({
//         include: [{
//                 model: User,
//                 as: 'owner',
//                 attributes: ['id', 'username', 'email', 'department'],
//             },
//             {
//                 model: ProjectMember,
//                 as: 'members',
//                 include: [{
//                     model: User,
//                     as: 'user',
//                     attributes: ['id', 'username', 'email', 'department'],
//                 }],
//             },
//         ],
//         order: [
//             ['startDate', 'DESC']
//         ]
//     });
// };