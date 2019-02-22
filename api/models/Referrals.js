const Sequelize = require('sequelize');
const UserTbl=require('./Users');
const sequelize = require('../../config/database');

const tableName = 'Referrals';

const Referral = sequelize.define('Referrals', {
        
    rootUserId:{
            type:Sequelize.INTEGER
        }
    }, 
    {  tableName });

Referral.belongsTo(UserTbl, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
UserTbl.hasMany(Referral, {foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

module.exports = Referral;
