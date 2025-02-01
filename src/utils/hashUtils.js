const bcrypt = require('bcrypt');
const path = require('path');
const { fileURLToPath } = require('url');

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword,
    __dirname,
};