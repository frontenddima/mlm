const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const User=require('../models/users');

const tableName = 'Bonuses';
const Bonuses = sequelize.define('Bonuses', {
   
    bonusesType: {
        type: Sequelize.STRING,
        unique: true,
    },
    BonusesToken: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING,
    } 
}, 
{  tableName });

Bonuses.belongsTo(User, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
User.hasMany(Bonuses, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
module.exports = Bonuses;
