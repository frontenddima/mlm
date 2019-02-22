const CallsLogs = require('../models/CallsLogs');
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const callsLogController = () => {

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

const AddCallsLog=(req, res)=>{
    const body = req.body;

    return sequelize.query('INSERT INTO  `tyslin-mcw`.calls_log ( SenderId, ReceiverId, '+body.test+', Duration, createdAt, updatedAt) VALUES (0304,111,1,"ten sec",CURDATE(),CURDATE()); ',{raw:true,type: Sequelize.QueryTypes.INSERT})
    .then((queryResponse)=>{
        console.log(queryResponse)
        res.send(queryResponse)
    })
    .catch((error)=>{
        res.send(error.message)
    })

}



return{
    GetCallsLog,AddCallsLog
}

}



module.exports = callsLogController;
