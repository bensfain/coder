/**
 * @fileoverview Review and recommendations for RadioSparx Research Project Management API
 * @author Code Reviewer
 * @version 1.0.0
 */

/**
 * @file src/controllers/authController.js
 * @desc Authentication controller handling login functionality
 * @issues
 * - Line 7-50: No input validation for username and password
 * - Line 11-18: Error message reveals whether username exists (security issue)
 * - Line 26-33: Duplicate error response structure that reveals authentication details
 * - Line 36-37: Token expiration set redundantly (in variable and JWT options)
 * - Line 38-42: JWT has no audience or issuer claims for additional security
 * - Line 7-50: No refresh token mechanism implemented
 * - Line 50: Error handling exposes internal error messages to client
 *
 * @recommendations
 * - Add validation middleware using express-validator or Joi
 * - Use generic error messages that don't reveal user existence
 * - Implement consistent error response structure
 * - Remove redundant token expiration setting
 * - Add refresh token functionality
 * - Create proper auth middleware for route protection
 * - Set proper token claims (aud, iss) and use strong JWT secret
 *
 * @example
 * // Add input validation
 * const { body, validationResult } = require('express-validator');
 *
 * // Login route with validation middleware
 * router.post('/login', [
 *   body('username').trim().isLength({ min: 3 }).escape(),
 *   body('password').isLength({ min: 6 }),
 * ], authController.login);
 *
 * // In controller:
 * exports.login = async(req, res) => {
 *   // Check for validation errors
 *   const errors = validationResult(req);
 *   if (!errors.isEmpty()) {
 *     return res.status(400).json({
 *       status: "error",
 *       code: 400,
 *       errors: errors.array(),
 *       message: "Validation failed"
 *     });
 *   }
 *
 *   // Use consistent error message
 *   const errorResponse = {
 *     status: "error",
 *     code: 401,
 *     message: "Invalid credentials"
 *   };
 *
 *   // Rest of login logic...
 * }
 */

/**
 * @file src/controllers/projectController.js
 * @desc Controller handling project-related operations
 * @issues
 * - Line 3-9: No authentication check for accessing projects
 * - Line 3-9: No pagination for getAllProjects (performance issue with large datasets)
 * - Line 12-19: No input validation for project ID
 * - Line 22-37: No validation for createProject data
 * - Line 22-37: Direct use of req.body without sanitization
 * - Line 40-46: Update method doesn't validate update data
 * - Line 40-46: Response format inconsistent with createProject
 * - Line 49-55: Delete method doesn't check user permissions
 * - All methods: Inconsistent error response format
 *
 * @recommendations
 * - Add authentication middleware to all routes
 * - Implement pagination for collection endpoints
 * - Add input validation for all parameters and request body
 * - Standardize response format across all methods
 * - Implement permission checks for CUD operations
 * - Create consistent error handling
 *
 * @example
 * // Standardized controller pattern
 * exports.getAllProjects = async(req, res, next) => {
 *   try {
 *     // Add pagination
 *     const page = parseInt(req.query.page) || 1;
 *     const limit = parseInt(req.query.limit) || 10;
 *     const offset = (page - 1) * limit;
 *
 *     const projects = await Project.getAll(limit, offset);
 *     const total = await Project.count();
 *
 *     return res.status(200).json({
 *       status: "success",
 *       code: 200,
 *       data: {
 *         projects,
 *         pagination: {
 *           total,
 *           page,
 *           limit,
 *           pages: Math.ceil(total / limit)
 *         }
 *       }
 *     });
 *   } catch (error) {
 *     next(error); // Use global error handler
 *   }
 * };
 */

/**
 * @file src/models/projectModel.js
 * @desc Model handling project-related database operations
 * @issues
 * - Line 4-7: SELECT * query without limits (potential performance issue)
 * - Line 10-17: No validation for project ID
 * - Line 20-58: Hard-coded leadResearcherId (set to 1)
 * - Line 20-58: No input validation or sanitization
 * - Line 31-49: SQL queries directly using user input
 * - Line 61-65: Update method only updates project_members, not the actual project
 * - Line 67-69: Delete method doesn't handle related records (team_members)
 * - Line 67-69: No permission check before deletion
 *
 * @recommendations
 * - Add limits to SELECT queries
 * - Validate all input parameters
 * - Remove hardcoded values
 * - Implement proper data validation before database operations
 * - Fix update method to update project data correctly
 * - Implement cascade delete or handle related records
 * - Add proper error handling for database constraints
 *
 * @example
 * // Improved getAll method with pagination
 * static async getAll(limit = 10, offset = 0) {
 *   const [rows] = await db.query(
 *     "SELECT * FROM research_projects LIMIT ? OFFSET ?",
 *     [limit, offset]
 *   );
 *   return rows;
 * }
 *
 * // Fixed update method
 * static async update(id, data) {
 *   const { title, description, status, start_date, end_date, budget,
 *           confidentiality_level, team_members } = data;
 *
 *   const connection = await db.getConnection();
 *   try {
 *     await connection.beginTransaction();
 *
 *     // Update project data
 *     await connection.query(
 *       `UPDATE research_projects
 *        SET title = ?, description = ?, status = ?, start_date = ?,
 *            end_date = ?, budget = ?, confidentiality_level = ?
 *        WHERE id = ?`,
 *       [title, description, status, start_date, end_date,
 *        budget, confidentiality_level, id]
 *     );
 *
 *     // Update team members if provided
 *     if (team_members && team_members.length > 0) {
 *       // First delete existing members
 *       await connection.query(
 *         "DELETE FROM project_members WHERE project_id = ?", [id]
 *       );
 *
 *       // Then insert new members
 *       for (const member of team_members) {
 *         await connection.query(
 *           "INSERT INTO project_members (project_id, user_id, role, contribution_percentage) VALUES (?, ?, ?, ?)",
 *           [id, member.user_id, member.role, member.contribution_percentage]
 *         );
 *       }
 *     }
 *
 *     await connection.commit();
 *   } catch (error) {
 *     await connection.rollback();
 *     throw error;
 *   } finally {
 *     connection.release();
 *   }
 * }
 */

/**
 * @file src/models/userModel.js
 * @desc Model handling user-related database operations
 * @issues
 * - Line 4-7: Returns all user data including password hash (security issue)
 * - Line 5: No validation for username parameter
 * - Line 4-7: Limited functionality, only has findByUsername method
 * - Missing methods for user creation, update, and password reset
 *
 * @recommendations
 * - Exclude password from returned user object
 * - Add validation for all input parameters
 * - Expand model to include createUser, updateUser methods
 * - Add password reset functionality
 *
 * @example
 * // Improved findByUsername method
 * static async findByUsername(username) {
 *   // Validate username
 *   if (!username || typeof username !== 'string') {
 *     throw new Error('Invalid username parameter');
 *   }
 *
 *   const [rows] = await db.query(
 *     "SELECT id, username, email, role, department, created_at, updated_at FROM users WHERE username = ?",
 *     [username]
 *   );
 *   return rows[0];
 * }
 *
 * // Method to get user with password for auth
 * static async findByUsernameWithPassword(username) {
 *   const [rows] = await db.query(
 *     "SELECT * FROM users WHERE username = ?",
 *     [username]
 *   );
 *   return rows[0];
 * }
 *
 * // Add createUser method
 * static async create(userData) {
 *   const { username, email, password, role, department } = userData;
 *
 *   // Hash password
 *   const salt = await bcrypt.genSalt(12);
 *   const hashedPassword = await bcrypt.hash(password, salt);
 *
 *   const [result] = await db.query(
 *     "INSERT INTO users (username, email, password, role, department) VALUES (?, ?, ?, ?, ?)",
 *     [username, email, hashedPassword, role || 'viewer', department]
 *   );
 *
 *   return result.insertId;
 * }
 */

/**
 * @file src/config/db.js
 * @desc Database configuration and connection setup
 * @issues
 * - Line 3-13: No error handling for database connection failures
 * - Line 4-10: Connection pool settings may not be optimal for production
 * - Line 3-13: Missing SSL configuration for secure connections
 * - No health check or reconnection mechanism
 *
 * @recommendations
 * - Add error handling for database connection failures
 * - Review and optimize connection pool settings
 * - Add SSL configuration for production
 * - Implement connection health checks
 *
 * @example
 * // Improved database configuration
 * const mysql = require('mysql2');
 * require('dotenv').config();
 *
 * // Connection pool configuration
 * const poolConfig = {
 *   host: process.env.DB_HOST,
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME,
 *   waitForConnections: true,
 *   connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 10,
 *   queueLimit: 0,
 *   enableKeepAlive: true,
 *   keepAliveInitialDelay: 30000
 * };
 *
 * // Add SSL in production
 * if (process.env.NODE_ENV === 'production' && process.env.DB_SSL === 'true') {
 *   poolConfig.ssl = {
 *     rejectUnauthorized: true
 *   };
 * }
 *
 * const pool = mysql.createPool(poolConfig);
 * const promisePool = pool.promise();
 *
 * // Test connection and handle errors
 * promisePool.query('SELECT 1')
 *   .then(() => console.log('Database connection established'))
 *   .catch(err => {
 *     console.error('Database connection failed:', err);
 *     process.exit(1);
 *   });
 *
 * module.exports = promisePool;
 */

/**
 * @file src/routes/authRoutes.js
 * @desc Authentication routes definition
 * @issues
 * - Line 5: Limited authentication routes (only login)
 * - Missing signup, logout, password reset, and token refresh routes
 * - No input validation middleware
 * - No rate limiting for sensitive routes
 *
 * @recommendations
 * - Add complete authentication routes (signup, logout, refresh)
 * - Implement password reset functionality
 * - Add input validation middleware
 * - Implement rate limiting for login attempts
 *
 * @example
 * const express = require('express');
 * const router = express.Router();
 * const { body } = require('express-validator');
 * const rateLimit = require('express-rate-limit');
 * const authController = require('../controllers/authController');
 *
 * // Rate limiting for login attempts
 * const loginLimiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // 5 attempts per window
 *   message: {
 *     status: 'error',
 *     message: 'Too many login attempts, please try again later'
 *   }
 * });
 *
 * // Login route with validation
 * router.post('/login', loginLimiter, [
 *   body('username').trim().isLength({ min: 3 }).escape(),
 *   body('password').isLength({ min: 6 })
 * ], authController.login);
 *
 * // Registration route
 * router.post('/register', [
 *   body('username').trim().isLength({ min: 3 }).escape(),
 *   body('email').isEmail().normalizeEmail(),
 *   body('password').isLength({ min: 8 })
 *     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
 *     .withMessage('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character')
 * ], authController.register);
 *
 * // Token refresh route
 * router.post('/refresh-token', authController.refreshToken);
 *
 * // Logout route
 * router.post('/logout', authController.logout);
 *
 * // Password reset request
 * router.post('/forgot-password', [
 *   body('email').isEmail().normalizeEmail()
 * ], authController.forgotPassword);
 *
 * // Password reset with token
 * router.post('/reset-password/:token', [
 *   body('password').isLength({ min: 8 })
 * ], authController.resetPassword);
 *
 * module.exports = router;
 */

/**
 * @file src/routes/projectRoutes.js
 * @desc Project management routes definition
 * @issues
 * - Line 4-9: No authentication middleware for protected routes
 * - No input validation middleware
 * - No route-specific authorization checks
 * - Missing routes for related resources (team members, logs, samples)
 *
 * @recommendations
 * - Add authentication middleware to protect routes
 * - Implement validation middleware for request data
 * - Add role-based authorization checks
 * - Create routes for related resources
 *
 * @example
 * const express = require('express');
 * const router = express.Router();
 * const { body, param, query } = require('express-validator');
 * const projectController = require('../controllers/projectController');
 * const auth = require('../middleware/auth');
 *
 * // Get all projects with pagination and optional filtering
 * router.get('/projects',
 *   auth.verifyToken,
 *   [
 *     query('page').optional().isInt({ min: 1 }),
 *     query('limit').optional().isInt({ min: 1, max: 100 }),
 *     query('status').optional().isIn(['planning', 'active', 'completed', 'cancelled'])
 *   ],
 *   projectController.getAllProjects
 * );
 *
 * // Get project by ID
 * router.get('/projects/:id',
 *   auth.verifyToken,
 *   [param('id').isInt({ min: 1 })],
 *   projectController.getProjectById
 * );
 *
 * // Create new project (admin and researcher only)
 * router.post('/projects',
 *   auth.verifyToken,
 *   auth.hasRole(['admin', 'researcher']),
 *   [
 *     body('title').trim().isLength({ min: 3, max: 255 }),
 *     body('description').optional().trim(),
 *     body('status').isIn(['planning', 'active', 'completed', 'cancelled']),
 *     body('start_date').optional().isDate(),
 *     body('end_date').optional().isDate(),
 *     body('budget').optional().isFloat({ min: 0 }),
 *     body('confidentiality_level').isIn(['public', 'internal', 'restricted', 'classified']),
 *     body('team_members').optional().isArray()
 *   ],
 *   projectController.createProject
 * );
 *
 * // Update project
 * router.put('/projects/:id',
 *   auth.verifyToken,
 *   auth.isProjectLeadOrAdmin,
 *   [param('id').isInt({ min: 1 })],
 *   projectController.updateProject
 * );
 *
 * // Delete project (admin only)
 * router.delete('/projects/:id',
 *   auth.verifyToken,
 *   auth.hasRole(['admin']),
 *   [param('id').isInt({ min: 1 })],
 *   projectController.deleteProject
 * );
 *
 * // Project members routes
 * router.get('/projects/:id/members',
 *   auth.verifyToken,
 *   [param('id').isInt({ min: 1 })],
 *   projectController.getProjectMembers
 * );
 *
 * router.post('/projects/:id/members',
 *   auth.verifyToken,
 *   auth.isProjectLeadOrAdmin,
 *   [param('id').isInt({ min: 1 })],
 *   projectController.addProjectMember
 * );
 *
 * module.exports = router;
 */

/**
 * @fileoverview Suggested new middleware files to implement
 */

/**
 * @file src/middleware/auth.js (to be created)
 * @desc Authentication and authorization middleware
 * @recommendation
 * Create middleware for token validation, role-based access control,
 * and project-specific authorization checks
 *
 * @example
 * const jwt = require('jsonwebtoken');
 * require('dotenv').config();
 *
 * // Verify JWT token middleware
 * exports.verifyToken = (req, res, next) => {
 *   const authHeader = req.headers.authorization;
 *
 *   if (!authHeader || !authHeader.startsWith('Bearer ')) {
 *     return res.status(401).json({
 *       status: 'error',
 *       code: 401,
 *       message: 'Authentication required'
 *     });
 *   }
 *
 *   const token = authHeader.split(' ')[1];
 *
 *   try {
 *     const decoded = jwt.verify(token, process.env.JWT_SECRET);
 *     req.user = decoded;
 *     next();
 *   } catch (error) {
 *     return res.status(401).json({
 *       status: 'error',
 *       code: 401,
 *       message: 'Invalid or expired token'
 *     });
 *   }
 * };
 *
 * // Role-based authorization middleware
 * exports.hasRole = (roles) => {
 *   return (req, res, next) => {
 *     if (!req.user) {
 *       return res.status(401).json({
 *         status: 'error',
 *         code: 401,
 *         message: 'Authentication required'
 *       });
 *     }
 *
 *     if (!roles.includes(req.user.role)) {
 *       return res.status(403).json({
 *         status: 'error',
 *         code: 403,
 *         message: 'You do not have permission to perform this action'
 *       });
 *     }
 *
 *     next();
 *   };
 * };
 *
 * // Project lead or admin check
 * exports.isProjectLeadOrAdmin = async (req, res, next) => {
 *   try {
 *     if (!req.user) {
 *       return res.status(401).json({
 *         status: 'error',
 *         code: 401,
 *         message: 'Authentication required'
 *       });
 *     }
 *
 *     // Admin can do anything
 *     if (req.user.role === 'admin') {
 *       return next();
 *     }
 *
 *     const projectId = parseInt(req.params.id);
 *     const Project = require('../models/projectModel');
 *     const project = await Project.getById(projectId);
 *
 *     // Check if user is project lead
 *     if (project && project.lead_researcher_id === req.user.userId) {
 *       return next();
 *     }
 *
 *     return res.status(403).json({
 *       status: 'error',
 *       code: 403,
 *       message: 'You do not have permission to modify this project'
 *     });
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 */

/**
 * @file src/middleware/validator.js (to be created)
 * @desc Validation middleware for request data
 * @recommendation
 * Create middleware for validating and sanitizing request data
 *
 * @example
 * const { validationResult } = require('express-validator');
 *
 * // Middleware to handle validation errors
 * exports.validate = (req, res, next) => {
 *   const errors = validationResult(req);
 *   if (!errors.isEmpty()) {
 *     return res.status(400).json({
 *       status: 'error',
 *       code: 400,
 *       errors: errors.array(),
 *       message: 'Validation failed'
 *     });
 *   }
 *   next();
 * };
 *
 * // Common validation schemas
 * exports.projectSchema = [
 *   body('title').trim().isLength({ min: 3, max: 255 })
 *     .withMessage('Title must be between 3 and 255 characters'),
 *   body('description').optional().trim(),
 *   body('status').isIn(['planning', 'active', 'completed', 'cancelled'])
 *     .withMessage('Invalid project status'),
 *   body('start_date').optional().isDate()
 *     .withMessage('Start date must be a valid date'),
 *   body('end_date').optional().isDate()
 *     .withMessage('End date must be a valid date'),
 *   body('budget').optional().isFloat({ min: 0 })
 *     .withMessage('Budget must be a positive number'),
 *   body('confidentiality_level').isIn(['public', 'internal', 'restricted', 'classified'])
 *     .withMessage('Invalid confidentiality level'),
 *   body('team_members').optional().isArray()
 *     .withMessage('Team members must be an array')
 * ];
 */

/**
 * @file src/middleware/errorHandler.js (to be created)
 * @desc Global error handling middleware
 * @recommendation
 * Create middleware for consistent error handling across the application
 *
 * @example
 * // Not Found handler
 * exports.notFound = (req, res, next) => {
 *   const error = new Error(`Not Found - ${req.originalUrl}`);
 *   res.status(404);
 *   next(error);
 * };
 *
 * // Global error handler
 * exports.errorHandler = (err, req, res, next) => {
 *   // Log error for server-side debugging
 *   console.error(err.stack);
 *
 *   // Handle specific error types
 *   if (err.name === 'ValidationError') {
 *     return res.status(400).json({
 *       status: 'error',
 *       code: 400,
 *       message: err.message
 *     });
 *   }
 *
 *   if (err.name === 'JsonWebTokenError') {
 *     return res.status(401).json({
 *       status: 'error',
 *       code: 401,
 *       message: 'Invalid token'
 *     });
 *   }
 *
 *   // Default error response
 *   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
 *
 *   res.status(statusCode).json({
 *     status: 'error',
 *     code: statusCode,
 *     message: process.env.NODE_ENV === 'production'
 *       ? 'Internal Server Error'
 *       : err.message
 *   });
 * };
 */
