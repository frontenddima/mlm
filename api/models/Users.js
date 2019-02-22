const Sequelize = require('sequelize');
const bcryptSevice = require('../services/bcrypt.service');

const sequelize = require('../../config/database');


const tableName = 'users';

const Users = sequelize.define('users', {
    name:{
        type:Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
//        unique: true,
    },
    email: {
        type: Sequelize.STRING
    },
    phoneNO: {
        type: Sequelize.STRING,
    },
    password:{
        type:Sequelize.STRING
    },
    ethAddress:{
        type:Sequelize.STRING
    },
    TotalTyslinBalance:{
        type:Sequelize.DECIMAL
    },
    TotalEhtereumBalance:{
        type:Sequelize.DECIMAL
    },
    isDeleted:{
        type:Sequelize.BOOLEAN
    }

}, { tableName });

module.exports = Users;
