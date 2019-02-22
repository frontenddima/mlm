const Sequelize = require('sequelize');
const bcryptSevice = require('../services/bcrypt.service');

const sequelize = require('../../config/database');


const tableName = 'calls_log';

const callsLog = sequelize.define('callsLog', {
    conversation_id:{
        type:Sequelize.INTEGER,
    },
    sender_id: {
        type: Sequelize.INTEGER,
        unique: true,
    },
    call_status: {
        type: Sequelize.BOOLEAN
    },
    start_time: {
        type: Sequelize.STRING,
    },
    end_time:{
        type:Sequelize.STRING
    }

}, { tableName });

module.exports = callsLog;
