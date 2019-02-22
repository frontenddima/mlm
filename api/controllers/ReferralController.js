const Transactions = require('../models/Referrals');
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const ReferralController = ()=>{
    const GetCallsLog=(req, res)=>{
    
        return sequelize.query('SELECT * FROM `tyslin-mcw`.calls_log limit 1 ',{raw:true,type: Sequelize.QueryTypes.SELECT})
        .then((queryResponse)=>{
            console.log(queryResponse)
            res.send(queryResponse[0].id)
        })
        .catch((error)=>{
            res.send(error.message)
        })
    
    }
    
}

module.exports=ReferralController;