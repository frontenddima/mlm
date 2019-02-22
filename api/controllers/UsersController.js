const User = require('../models/users');
const Referrals=require('../models/Referrals')
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const Op = require('../../config/database');
const bcryptService = require('../services/bcrypt.service');


const UsersController = ( ) => {
    const test =(req,res) =>{
        res.send("TESTING")
    }

    const newUserRegistration=(req,res)=>{
        try{
            const body=req.body;
            if(body.phoneNO && body.password)
            {
                console.log("phoneNO::",body.phoneNO)
            User.findOne({
                    where: {phoneNO:body.phoneNO}
                })
                .then((users) => {
                        console.log("Start",users);
                        const template = {
                            password: body.password
                        }
                        
                            if(!users)
                            {
                                return User
                                .create({ 
                                    name:body.name,
                                    type:body.type,
                                    email:body.email,
                                    phoneNO:body.phoneNO,
                                    password:bcryptService.password(template),
                                    ethAddress:body.ethAddress,
                                    tyslinTotalBalance:body.tyslinTotalBalance,
                                    isDeleted:0
                                })
                                .then((userRegistrationResponse) =>{
                                      console.log("userRegistrationResponse.id:"+userRegistrationResponse.id);
                                        return Referrals
                                        .create({
                                            referralId:body.referralId,
                                            user_id:userRegistrationResponse.id
                                        })
                                        .then((userReferralResponse) =>{
                                        
                                           res.send("User has been Successfully Registred.");
                                        })
                                        .catch((error)=>{
                                            res.send(error.message)
                                        })

                       
                                })
                                .catch((error)=>{
                                    res.send(error.message)
                                })
                            }
                            else{
                                console.log('User is already exists   ')
                                res.send("User email or Phone No is already exists please use unique email and Phone No. ")
                            }
        
                    })
                    .catch((error)=>{
                        console.log("Error is here")
                        res.send(error.message);
                    })
        
                }
              
        }
        catch(error) {
        
            const val = {
                err: error.message
            }
            res.send(val);
        }
        
        
        
           }
const loginUser=(req,res)=> {
    const body=req.body;
    return sequelize.query('SELECT id, name, type, email, phoneNO, password, ethAddress, tyslinTotalBalance, isDeleted, createdAt, updatedAt      FROM MLM_tyslin.mlmUsers where phoneNO='+body.email_Phone+' OR email='+body.email_Phone+';    ',{raw:true,type: Sequelize.QueryTypes.SELECT})
    .then((queryResponse)=>{
        console.log(queryResponse)
        if (queryResponse===undefined || queryResponse ==0 )
        {
            res.send("login failed please try again.");
        }
        else{
            res.send(queryResponse )
        }

        })
    .catch((error)=>{
        res.send(error.message)
    })

}

    return{
        test,
        newUserRegistration,
        loginUser
    }
};

module.exports=UsersController;
 