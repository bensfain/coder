// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const { port } = require('./config');
const app = express();
app.use(bodyParser.json()); // Parsing JSON dari body request
// Menggunakan routing
app.use('/api/auth', authRoutes);
// Jalankan server
app.listen(port, () => {
    console.log(`Server Berjalan pada port ${port}`);
});