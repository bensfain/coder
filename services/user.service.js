const User = require('../models/User');

const findByUsername = async(username) => {
    return await User.findOne({ where: { username } });
};

module.exports = {
    findByUsername
};