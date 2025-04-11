require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
    console.log('Connected to MySQL');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});