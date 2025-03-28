// models/user.js
const bcrypt = require('bcryptjs');
let users = [{
    id: 1,
    username: 'testuser',
    password: bcrypt.hashSync('password', 10), //
    //Enkripsi password
}];
module.exports = {
    findByUsername: (username) => users.find(user =>
        user.username === username),
    findById: (id) => users.find(user => user.id === id),
};