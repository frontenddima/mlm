const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const UserTbl=require('../models/users');

const tableName = 'Transactions';
const Transactions = sequelize.define('Transactions', {
   
    txHashname: {
        type: Sequelize.STRING,
        unique: true,
    },
    currencyType: {
        type: Sequelize.STRING
    },
    ethAmount: {
        type: Sequelize.STRING,
    },
    tyslinTokenBalance:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    }
}, 
{  tableName });

Transactions.belongsTo(UserTbl, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
UserTbl.hasMany(Transactions, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
module.exports = Transactions;
