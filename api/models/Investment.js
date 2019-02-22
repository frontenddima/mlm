const Sequelize = require('sequelize');
const UserTbl=require('./Users');
const sequelize = require('../../config/database');

const tableName = 'Investments';

const Investment = sequelize.define('Investment', {
        
    user_id:{
            type:Sequelize.INTEGER
        },
        noOfEthererumInvest:{
            type:Sequelize.INTEGER
        },
        noOfTyslinPurchased:{
            type:Sequelize.INTEGER
        },
        purchasedStatus:{
            type:Sequelize.STRING
        },
    }, 
    {  tableName });

    Investment.belongsTo(UserTbl, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
    UserTbl.hasMany(Investment, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
    module.exports = Investment;
