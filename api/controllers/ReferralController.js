const Transactions = require('../models/Referrals');
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const ReferralController = ()=>{
    const getRootUserReferralsList=(req, res)=>{
    const body =req.body
        return sequelize.query('SELECT u.id,u.name,u.TotalEhtereumBalance,u.TotalTyslinBalance ,i.user_id ,i.noOfEthererumInvest, i.noOfTyslinPurchased, i.purchasedStatus, i.createdAt FROM MLM_tyslin.users u  inner join MLM_tyslin.Referrals r on r.user_id = u.id   inner join MLM_tyslin.Investments i   on i.user_id=r.user_id where r.rootUserId='+body.rootUserId+' ',{raw:true,type: Sequelize.QueryTypes.SELECT})
        .then((queryResponse)=>{
            console.log(queryResponse)
            res.send(queryResponse)
        })
        .catch((error)=>{
            res.send(error.message)
        })
    
    }
    return{
        getRootUserReferralsList
    }
}

module.exports=ReferralController;