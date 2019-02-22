/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const fs = require('fs');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const morgan = require('morgan');

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');
const auth = require('./policies/auth.policy');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log("user connected");
    io.emit('con');
});

const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');
const mappedAuthRoutes = mapRoutes(config.privateRoutes, 'api/controllers/');

const DB = dbService(environment, config.migrate).start();


// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

app.use(morgan('combined'));

app.use(function (req, res, next) {
    console.log('Response Code:', res.statusCode);
    if(req.originalUrl === '/public/order'){
        io.emit('hit');
    }
    next();
});

// secure express app
app.use(helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//health
app.get('/health', async function(req, res) {
    res.status(200).send("api okay");

});
app.get('/socket.io', async function(req, res) {
    res.send({
        status:true,
        msg:"testing for Socket.io"
    })
});
app.get('/test', async function(req,res){
    try{
        // const file= 
    const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: 'hm79405@gmail.com',
            from: 'test@example.com',
            subject: 'Testing . . .',
            text: 'Welcome To the Testing Phase of sending Email',
            html: '<!doctype html><html><head><meta name=\"viewport\" content=\"width=device-width\" /><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><title>Simple Transactional Email</title><link href=\"https://fonts.googleapis.com/css?family=Montserrat\" rel=\"stylesheet\"><style>*{font-family:\'Montserrat\',sans-serif !important}img{border:none;-ms-interpolation-mode:bicubic;max-width:100%}body{background-color:#f6f6f6;font-family:\'Montserrat\',sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%}table td{font-family:sans-serif;font-size:14px;vertical-align:top}.body{background-color:#f6f6f6;width:100%}.container{display:block;margin:0 auto !important;max-width:580px;padding:10px;width:580px}.content{box-sizing:border-box;display:block;margin:0 auto;max-width:580px;padding:10px}.main{background:#fff;border-radius:3px;width:100%;background-size:100%;text-align:center;margin:20px auto;position:relative}table.main::after{background:linear-gradient(-45deg, #f6f6f6 16px, #f6f6f600 0), linear-gradient(45deg, #f6f6f6 16px, transparent 0);background-position:left-bottom;background-repeat:repeat-x;background-size:32px 32px;content:\" \";display:block;position:absolute;bottom:0px;left:0px;width:100%;height:32px}.wrapper{padding:30px;box-shadow:5px -5px 15px 0px rgba(188,188,188,0.1)}.content-block{padding-bottom:10px;padding-top:10px}.footer{clear:both;margin-top:10px;text-align:center;width:100%}.footer td, .footer p, .footer span, .footer a{color:#999;font-size:12px;text-align:center}span{font-size:12px;color:#ccc}h1{margin-bottom:10px !important}h2,h3,h4{color:#000;font-family:sans-serif;font-weight:400;line-height:1.4;margin:0;margin-bottom:30px}h1{font-size:35px;font-weight:300;text-align:center;text-transform:capitalize}p,ul,ol{font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;margin-bottom:15px;font-weight:100}p li, ul li, ol li{list-style-position:inside;margin-left:5px}a{color:#3498db;text-decoration:underline}.btn{box-sizing:border-box;width:100%}.btn>tbody>tr>td{padding-bottom:15px}.btn table{width:auto}.btn table td{background-color:#fff;border-radius:5px;text-align:center}.btn a{background-color:#fff;border:solid 1px #3498db;border-radius:5px;box-sizing:border-box;color:#3498db;cursor:pointer;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize}.btn-primary table td{background-color:#3498db}.btn-primary a{background-color:#34db6c;border-color:#34db66;color:#fff}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}hr{border:0;border-bottom:1px solid #f6f6f6;margin:20px 0}@media only screen and (max-width: 620px){table[class=body] h1{font-size:28px !important;margin-bottom:10px !important}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size:16px !important}table[class=body] .wrapper, table[class=body] .article{padding:10px !important}table[class=body] .content{padding:0 !important}table[class=body] .container{padding:0 !important;width:100% !important}table[class=body] .main{border-left-width:0 !important;border-radius:0 !important;border-right-width:0 !important}table[class=body] .btn table{width:100% !important}table[class=body] .btn a{width:100% !important}table[class=body] .img-responsive{height:auto !important;max-width:100% !important;width:auto !important}}@media all{.ExternalClass{width:100%}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%}.apple-link a{color:inherit !important;font-family:inherit !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important;text-decoration:none !important}.btn-primary table td:hover{background-color:#34495e !important;margin:0 auto}.btn-primary a:hover{background-color:crimson !important;border-color:#fff !important}}</style></head><body class=\"\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"body\"><tr><td>&nbsp;</td><td class=\"container\"><div class=\"content\"><div id=\"logo\" style=\"text-align: center;\"> <img src=\"https://s3-ap-southeast-1.amazonaws.com/montikristo/EmailTemplate/logo.png\" alt=\"Logo\"></div> <span class=\"preheader\">This is preheader text. Some clients will show this text as a preview.</span><table role=\"presentation\" class=\"main\"><tr><td class=\"wrapper\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td><div id=\"icon-wrapper\" style=\"margin: 20px auto; width:150px\"> <img src=\"https://s3-ap-southeast-1.amazonaws.com/montikristo/EmailTemplate/icon.png\" alt=\"company icon\"></div><p style=\"width:100%; text-align: center; font-size:17px \">Almost done, <b>@username</b>! To complete your Monti Kristo <br/> signup, we just need you to verify your email address:</p><h2 style=\"color:rgb(56, 105, 209)\">username@email.com</h2><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"btn btn-primary\"><tbody><tr><td align=\"center\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td> <a href=\"#\" target=\"_blank\">Verify Email Address</a></td></tr></tbody></table></td></tr></tbody></table><p style=\"width:100%; text-align: center\"><b>Once verified you start enjoying the perks of being the member of Monti Kristo family!</b></p><p style=\"width:100%; text-align: center\">Button not working? paste the following link into your browser: <a href=\"#\">http://www.montokristo/user-name/1232/user.com</a></p> <br/> <span style=\"margin:20px 0\"> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa repellendus cumque beatae quae velit sed nobis incidunt odit itaque deserunt! </span></td></tr></table></td></tr></table><div class=\"footer\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"content-block\"><h1 class=\"apple-link\">Monti Kristo</h1> <a href=\"#\" class=\"content-block powered-by\">www.montikristo.com</a>.</td></tr></table></div></div></td><td>&nbsp;</td></tr></table></body></html>'
        };
        const sent = await sgMail.send(msg);
        if(sent){
            console.log("MailHas Been Sent");
        }else{
            console.log("MailHas not sent");

        }
    }catch(error){
        console.log(error);
    }
  });
// fill routes for express appliction
app.use('/public', mappedOpenRoutes);
app.use('/private', mappedAuthRoutes);

// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

server.listen(config.port, () => {
    if (environment !== 'production' &&
        environment !== 'development' &&
        environment !== 'testing'
    ) {
        console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
        process.exit(1);
    }
    return DB;
});