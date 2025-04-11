const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const memberRoutes = require('./routes/memberRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const logRoutes = require('./routes/logRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', memberRoutes);
app.use('/api/projects', sampleRoutes);
app.use('/api/projects', logRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Terjadi kesalahan server'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});