# Code Review: RadioSparx Research Project Management API

## Executive Summary

This codebase implements a REST API for a Research Project Management System using Node.js/Express.js with JWT authentication and MySQL database integration. While the API achieves basic functionality, it has several critical issues related to security, error handling, code organization, and adherence to best practices that should be addressed urgently.

## Strengths

- Basic MVC architecture with separation between routes, controllers, and models
- Implementation of JWT authentication
- Database transaction handling for complex operations
- Simple and understandable code structure

## Critical Issues

1. **Insecure Password Storage**
   - Plaintext passwords in database (user "john_researcher")
   - Inconsistent password hashing implementation
2. **Weak JWT Implementation**
   - Hardcoded JWT secret in environment file
   - No route protection or authentication middleware
3. **Lack of Input Validation**
   - No validation for incoming request data
   - Potential for injection attacks
4. **SQL Injection Vulnerabilities**
   - Inconsistent use of parameterized queries
   - Direct user input in SQL queries

## File-by-File Analysis

### 1. `server.js`

```js
const express = require("express");
const cors = require("cors");
const projectRoutes = require("./src/routes/projectRoutes");
const authRoutes = require("./src/routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Tambahkan route autentikasi
app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Issues:**

- CORS is configured without restrictions, allowing requests from any origin
- No security middleware implemented (helmet, rate limiting, etc.)
- No global error handling middleware
- Comments in Indonesian mixed with English code (inconsistent)

**Recommendations:**

- Configure CORS with specific allowed origins
- Implement security middleware like helmet
- Add global error handling middleware
- Standardize comments language (either English or Indonesian)

### 2. `src/controllers/authController.js`

```js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek apakah user ada di database
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: [{ field: "auth", message: "Username atau password salah" }],
        message: "Autentikasi gagal",
      });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: [{ field: "auth", message: "Username atau password salah" }],
        message: "Autentikasi gagal",
      });
    }

    // Buat token JWT
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token berlaku 1 jam

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response sukses
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        token: token,
        tokenExpiration: tokenExpiration.toISOString(),
      },
      message: "Login berhasil",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
```

**Critical Issues:**

- No input validation for username and password
- Error messages reveal whether username exists, aiding username enumeration attacks
- Token expiration is set redundantly (both in variables and JWT options)
- No refresh token mechanism
- No signup functionality or password reset capability
- Error response format is inconsistent with other parts of the application

**Security Concerns:**

- Some passwords in the database appear to be plaintext
- No brute force protection or rate limiting
- No CSRF protection

**Recommendations:**

- Add input validation using express-validator or Joi
- Use consistent error messages that don't reveal user existence
- Implement refresh tokens for better security
- Add rate limiting for login attempts
- Create middleware for authentication that can be used across routes
- Ensure all passwords are properly hashed with bcrypt (min 12 rounds)
- Implement CSRF protection

### 3. `src/controllers/projectController.js`

```js
const Project = require("../models/projectModel");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project tidak ditemukan" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const projectId = await Project.create(req.body);

    // Ambil kembali data proyek yang baru dibuat
    const newProject = await Project.getById(projectId);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        project: newProject,
      },
      message: "Proyek penelitian berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    await Project.update(req.params.id, req.body);
    res.json({ message: "Project telah di update !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.delete(req.params.id);
    res.json({ message: "Project telah dihapus !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Critical Issues:**

- No authentication or authorization checks
- No input validation for req.body data
- Inconsistent response format across different methods
- Direct use of user input without sanitization
- No pagination for getAllProjects, which could lead to performance issues with large datasets

**Recommendations:**

- Implement authentication middleware to protect routes
- Add input validation for all request data
- Standardize response format across all methods
- Add pagination, filtering, and sorting for collection endpoints
- Implement proper error handling with consistent format

### 4. `src/models/projectModel.js`

```js
const db = require("../config/db");

class Project {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM research_projects");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      `SELECT id, title, description, status, start_date, end_date, budget, 
                        confidentiality_level, lead_researcher_id, created_at 
                 FROM research_projects WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const {
      title,
      description,
      status,
      start_date,
      end_date,
      budget,
      confidentiality_level,
      team_members,
    } = data;
    const leadResearcherId = 1; // Set default ke 1

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert proyek
      const [result] = await connection.query(
        `INSERT INTO research_projects 
                    (title, description, status, start_date, end_date, budget, confidentiality_level, lead_researcher_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          status,
          start_date,
          end_date,
          budget,
          confidentiality_level,
          leadResearcherId,
        ]
      );

      const projectId = result.insertId;

      // Insert anggota tim jika ada
      if (team_members && team_members.length > 0) {
        for (const member of team_members) {
          await connection.query(
            "INSERT INTO project_members (project_id, user_id, role, contribution_percentage) VALUES (?, ?, ?, ?)",
            [
              projectId,
              member.user_id,
              member.role,
              member.contribution_percentage,
            ]
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
      "UPDATE project_members SET role = ?, contribution_percentage = ? WHERE id = ?",
      [role, contribution_percentage, id]
    );
  }

  static async delete(id) {
    await db.query("DELETE FROM research_projects WHERE id = ?", [id]);
  }
}

module.exports = Project;
```

**Critical Issues:**

- Hard-coded leadResearcherId (set to 1) in create method
- Update method only updates project_members, not the actual project
- Delete method doesn't handle related records (team_members, etc.)
- No validation of input data
- No error handling for database constraints or data integrity issues

**Recommendations:**

- Remove hardcoded values like leadResearcherId
- Fix update method to actually update project data
- Implement cascade delete or handle related records in delete method
- Add data validation before database operations
- Implement proper error handling for database constraints

### 5. `src/models/userModel.js`

```js
const db = require("../config/db");

class User {
  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0]; // Ambil user pertama (jika ada)
  }
}

module.exports = User;
```

**Issues:**

- Extremely limited functionality, only has findByUsername method
- No methods for user creation, update, or password reset
- Returns all user data including password (should exclude sensitive fields)
- No input validation or sanitization

**Recommendations:**

- Expand model to include createUser, updateUser, and other necessary methods
- Exclude sensitive data like passwords from returned user objects
- Add methods for password reset and account management
- Implement input validation and sanitization

### 6. `src/config/db.js`

```js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
```

**Issues:**

- No error handling for database connection failures
- Default connection pool settings may not be optimal for production
- Missing configuration for other database aspects (SSL, etc.)

**Recommendations:**

- Add error handling for database connection failures
- Review and adjust connection pool settings based on expected load
- Consider SSL configuration for secure connections
- Add logging for database connection status

### 7. `src/routes/authRoutes.js`

```js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

module.exports = router;
```

**Issues:**

- Very limited authentication routes (only login)
- No signup, logout, password reset or token refresh routes
- No route documentation

**Recommendations:**

- Add signup, logout, and token refresh routes
- Implement password reset functionality
- Document routes with comments or OpenAPI/Swagger

### 8. `src/routes/projectRoutes.js`

```js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.get("/projects", projectController.getAllProjects);
router.get("/projects/:id", projectController.getProjectById);
router.post("/projects", projectController.createProject);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);

module.exports = router;
```

**Issues:**

- No authentication middleware for protected routes
- No validation middleware for request data
- Missing routes for related resources (project members, etc.)

**Recommendations:**

- Add authentication middleware to protect routes
- Implement request validation middleware
- Consider adding more specific routes for related resources

## Improvement Recommendations

### High Priority

1. **Security Enhancements**

   - Implement proper authentication middleware to protect routes
   - Add input validation and sanitization using express-validator or Joi
   - Ensure all passwords are hashed with bcrypt (min 12 rounds)
   - Generate a strong random JWT secret
   - Fix plaintext passwords in the database
   - Implement rate limiting for sensitive endpoints

2. **Error Handling and Response Format**

   - Create global error handling middleware
   - Standardize response format across all endpoints
   - Implement proper HTTP status codes for different scenarios
   - Add detailed error logging (but hide implementation details from users)

3. **Data Validation**
   - Add comprehensive input validation for all endpoints
   - Validate data types, formats, and constraints
   - Sanitize user inputs to prevent injection attacks
   - Implement consistent validation error responses

### Medium Priority

1. **Code Organization**

   - Create middleware folder for authentication, validation, etc.
   - Add utilities for common functions
   - Implement consistent error handling patterns
   - Standardize on one language for comments and messages

2. **API Improvements**

   - Add pagination for collection endpoints
   - Implement filtering and sorting capabilities
   - Document API with OpenAPI/Swagger
   - Add proper logging throughout the application

3. **Database Operations**
   - Fix update and delete methods to handle all related records
   - Remove hardcoded values
   - Implement proper transaction management
   - Add data validation at the database level

### Low Priority

1. **Testing**

   - Add unit tests for models and controllers
   - Implement integration tests for API endpoints
   - Set up automated testing in CI/CD pipeline

2. **Documentation**

   - Add code comments where necessary
   - Create comprehensive API documentation
   - Document database schema and relationships

3. **Performance Optimization**
   - Review and optimize database queries
   - Implement caching where appropriate
   - Consider adding indexes for frequently queried fields

## Conclusion

The codebase implements basic functionality but has several critical security and design issues that should be addressed before deployment to production. Following the recommendations in this review will significantly improve the security, maintainability, and reliability of the application.
