const User = require('../models/users');
const Investment=require('../models/Investment')
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Op = require('../../config/database');
const bcryptService = require('../services/bcrypt.service');

const InvestmentController = ( ) => {
console.log('InvestmentController')
    const purchaseTyslinCoins=(req,res)=>{
        const body= req.body;
        console.log('Start')
// this db insertion will be perform after call recieve from etherum

        try
        {
            console.log('try')
            if(body.user_id)
            {
                console.log('body.user_id'+body.user_id)
                return sequelize.query('SELECT id, ethAddress FROM MLM_tyslin.users   where  id=' +body.user_id+ ';',{raw:true,type: Sequelize.QueryTypes.SELECT})
                 .then((userResponse)=>{
                    console.log('userResponse'+userResponse)
                        console.log(userResponse[0].ethAddress);
                        return Investment
                        .create({
                            user_id:body.user_id,
                            noOfEthererumInvest:body.noOfEthererumInvest,
                            noOfTyslinPurchased:body.noOfTyslinPurchased,
                            purchasedStatus:"In progress",
                        })
                        .then((investmentResponse)=>{

                            res.send("your transaction has been completed.");

                        })


                }).catch((error)=>{
                 res.send(error.message)

                })

            }


        }
        catch(error){
            const val = {
                err: error.message
            }
            res.send(val);
        }
    
}

return{
    purchaseTyslinCoins
}
   


}
module.exports=InvestmentController;
