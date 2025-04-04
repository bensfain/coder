const express = require('express');
const cors = require('cors');
const projectRoutes = require('./src/routes/projectRoutes');
const authRoutes = require('./src/routes/authRoutes'); // Tambahkan ini
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Tambahkan route autentikasi
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});