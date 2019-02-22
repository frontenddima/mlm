const Sequelize = require('sequelize');
const bcryptSevice = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
    beforeCreate(user) {
        user.password = bcryptSevice.password(user); // eslint-disable-line no-param-reassign
    },
};

const instanceMethods = {
    toJSON() {
        const values = Object.assign({}, this.get());

        delete values.password;

        return values;
    },
};

const tableName = 'userstest';

const User = sequelize.define('User', {
    fullName:{
        type:Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
    role: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
    },
    profileImage:{
        type:Sequelize.STRING
    },
    keyStore:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING,
    },
    verificationToken:{
        type:Sequelize.STRING,
    },
    isEmailVerified: {
        type: Sequelize.STRING,
    }

}, { hooks, instanceMethods, tableName });

module.exports = User;