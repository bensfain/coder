const { getProjectMembers } = require("../controllers/projectMember.controller");
router.get("/projects/:id/members", authenticateToken, getProjectMembers);
const { getProjectSamples } = require("../controllers/sample.controller");
router.get("/projects/:id/samples", authenticateToken, getProjectSamples);
const { getProjectLogs } = require("../controllers/log.controller");
router.get("/projects/:id/logs", authenticateToken, getProjectLogs);