const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require("randomstring");
const d3 = require("d3-timer");
const moment = require('moment');

//For SMS Verification
const accountSid = 'ACd988838ed2c8cc0e4e25f26fd2448709';
const authToken = '07beb45e0ca19b0ea913fea5ca73a466';
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
//end

let verification_id = "";
let verification_code = "";
let smsVerificationCode = "";
let timer = 0;
require('dotenv').config();

const UserController = () => {
    verification_id = randomstring.generate();
    //User Registration
    const register = (req, res) => {

        // const body = req.body;
        try {
            const body = req.body;
            if (body.email && body.password) {

                var emailStr = body.email;
                var emailPatternRes = emailStr.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
                if (emailPatternRes != null) {
                    User
                        .findOne({ where: { email: body.email } })
                        .then((users) => {

                            const template = {
                                password: body.password
                            }

                            if (!users) {
                                return User
                                    .create({
                                        fullName: body.fullName,
                                        email: body.email,
                                        password: bcryptService.password(template),
                                        profileImage: body.profileImage,
                                        role: "user",
                                        status: "1",
                                        verificationToken: verification_id,
                                        isEmailVerified: "0",
                                        // createdAt: currentDatetime
                                    })
                                    .then((user) => {
                                        const token = authService.issue({ id: user.id });
                                        sendEmailforVerification(req, res);
                                        // res.status(200).json({ token, user });

                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res.status(500).json({ msg: 'Internal server error' });
                                    });
                            }
                            else {
                                //console.log("USer Email is",users.email);
                                const userError = {
                                    status: false,
                                    msg: "Email Already Exists"
                                }
                                res.send(userError);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json({ msg: 'Internal server error' });
                        });

                }
                else {
                    const emailPatternErr = {
                        status: false,
                        msg: "Error! Wrong Email Pattern"
                    }
                    res.send(emailPatternErr);

                }
            }
            else {

                const errorRes = {
                    status: false,
                    msg: "Error! Please Check Parameters"
                }
                res.send(errorRes);

            }
        } catch (error) {

            const val = {
                err: error.message
            }
            res.send(val);
        }

    };

    //Login Function
    const login = (req, res) => {
        this._tokenAmount
        const email = req.body.email;
        const password = req.body.password;
        if (email && password) {

            User
                .findOne({
                    where: {
                        email,
                    },
                })
                .then((user) => {

                    if (!user) {
                        return res.status(400).json({ status: false, msg: 'Bad Request: User not found' });
                    }
                    if (user.isEmailVerified == 0) {
                        return res.status(401).json({ status: false, msg: 'Email Not Verified' });
                    }
                    if (bcryptService.comparePassword(password, user.password)) {
                        const token = authService.issue({ id: user.id, fullName: user.fullName, email: user.email, profileImage: user.profileImage, role: user.role, isEmailVerified: user.isEmailVerified });

                        return res.status(200).json({ status: true, msg: 'Successfully login', token });
                    }

                    return res.status(200).json({ status: false, msg: 'Unauthorized' });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ msg: 'Internal server error' });
                });

        }
        else {
            const errorRes = {
                status: false,
                msg: "Error! Please Check Parameters"
            }
            res.send(errorRes);
        }
    };

    //Sending email verification link via email For Game
    const sendEmailforVerification = (req, res) => {
        // verification_id = randomstring.generate();
        const body = req.body;
        const verification_link = "<strong>Please verify your email for Etherin Cash</storng><br>http://tokenoffers-loadblncer-496397394.us-east-2.elb.amazonaws.com:83/public/user/verifyEmail/" + body.email + "/" + verification_id;
        var helper = require('sendgrid').mail;
        const fromEmail = new helper.Email("no_reply@reactivespace.com");
        const toEmail = new helper.Email(body.email);
        const subject = 'Etherin Cash verification Email';
        // const text = '<strong>Please verify your email for Etherin Cash</strong>';
        const content = new helper.Content('text/html', verification_link);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

        const sg = require('sendgrid')(process.env.API_KEY);
        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
            if (error) {
                console.log("This is error:", error)
                console.log('Error response received', response.statusCode, response.headers);
                return res.status(response.statusCode).json({ Error: response.headers });
            }

            timer = 0;

            //Countdown for verification link...
            var t = d3.timer(function (elapsed) {
                //console.log(elapsed);
                if (elapsed > 900000) {
                    timer = 15;
                    t.stop();
                }
            }, 150);

            res.status(response.statusCode).json({ status: true, msg: 'Account Verification Email Has Been Sent', response });

        });
    };



    //Sending password reset link via email
    const sendResetPasswordEmail = (req, res) => {
        verification_id = randomstring.generate(5);
        const body = req.body;
        const verification_link = "Verification code: " + verification_id;
        var helper = require('sendgrid').mail;
        const fromEmail = new helper.Email("no_reply@reactivespace.com");
        const toEmail = new helper.Email(body.email);
        const subject = 'Etherin Cash Password Reset Verification Code';
        const content = new helper.Content('text/plain', verification_link);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

        const sg = require('sendgrid')(process.env.API_KEY);

        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
            if (error) {
                console.log('Error response received');
                return res.status(response.statusCode).json({ Error: response.headers });
            }

            timer = 0;
            //Countdown for verification link...
            var t = d3.timer(function (elapsed) {
                //console.log(elapsed);
                if (elapsed > 900000) {
                    timer = 15;
                    t.stop();
                }
            }, 150);

            res.status(response.statusCode).json({ msg: response.headers });
        });
    };


    // Verify Email function is For CoinHunter Game 
    const verifyEmail = (req, res) => {
        const vEmail = req.params.email;
        const vToken = req.params.token;
        try {
            if (vEmail && vToken) {
                User
                    .findOne({ where: { email: vEmail } })
                    .then((user) => {
                        if (user.isEmailVerified == 0) {
                            const st = user.createdAt;
                            const start_date = moment(st);
                            const end_date = moment(new Date());
                            const duration = moment.duration(end_date.diff(start_date));
                            var minutes = duration.asMinutes();
                            console.log("Days : ", minutes);

                            if (minutes <= 1) {

                                return User
                                    .update({
                                        isEmailVerified: '1',
                                    }, {
                                            where: {
                                                email: vEmail,
                                                verificationToken: vToken
                                            }
                                        })
                                    .then((user) => {
                                        console.log(user);
                                        res.send("<h1>Congratulations! You Have Successfully Verified Your Email.</h1>");
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res.status(500).json({ msg: 'Internal server error!' });
                                    });

                            } else {
                                res.send("<h1>Verification Link Expire, Please Resend Verification Email !</h1>");
                            }

                        } else {
                            res.send("<h1>You Have Already Verified your Email</h1>");
                        }

                    }).catch((error) => {
                        console.log(error);
                        return res.status(500).json({ msg: 'Internal server error' });
                    });
            } else {
                return res.status(303).json({ 'msg': 'Please check You Parameters' });

            }
        }
        catch (e) {
            const error = {
                status: false,
                msg: "Somthing Went wrong Please Check"
            }
            res.send(error, e);
        }

    };

    //Upload Profile Image Link
    const resendVerificationEmail = (req, res) => {
        const body = req.body;
        if (body.email) {
            verification_Token = randomstring.generate();
            const currentDate = new Date();
            console.log("Changed Date is ", currentDate);
            User
                .findOne({
                    where: { email: body.email }
                })
                .then((user) => {

                    if (!user) {
                        const error = {
                            status: false,
                            msg: 'Bad Request: User not found'
                        }
                        res.send(error);
                    } else {
                        return User
                            .update({
                                createdAt: currentDate,
                                verificationToken: verification_Token
                            }
                                , {
                                    where: {
                                        email: body.email
                                    }
                                })
                            .then((updateStatus) => {
                                if (updateStatus == 1) {
                                    const verification_link = "http://localhost:3004/public/user/verifyEmail/" + body.email + "/" + verification_Token;;
                                    var helper = require('sendgrid').mail;
                                    const fromEmail = new helper.Email("no_reply@reactivespace.com");
                                    const toEmail = new helper.Email(body.email);
                                    const subject = 'Please verify your email for Etherin Cash';
                                    const content = new helper.Content('text/plain', verification_link);
                                    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

                                    const sg = require('sendgrid')(process.env.API_KEY);
                                    const request = sg.emptyRequest({
                                        method: 'POST',
                                        path: '/v3/mail/send',
                                        body: mail.toJSON()
                                    });

                                    sg.API(request, function (error, response) {
                                        if (error) {
                                            console.log('Error response received');
                                            return res.status(response.statusCode).json({ Error: response.headers });
                                        }
                                        res.status(response.statusCode).json({ status: true, msg: 'Account Verification Email Has Been Sent' });
                                    });
                                }
                                else {
                                    const error = {
                                        status: false,
                                        msg: "Error! While Sending New Verification email"
                                    }
                                    res.send(error);
                                }
                            }).catch((error) => {
                                console.log(error);
                                const updateError = {
                                    status: false,
                                    msg: "Bad server response.Please Contact your service provider"
                                }
                                res.send(updateError);
                            })
                    }
                })
                .catch((err) => {
                });
        } else {
            const error = {
                status: false,
                msg: "Error! Please check Parameters"
            }
            res.send(error);
        }
    }

    //Sending forgot password using 4-Digits Verification Code
    const sendforgotPasswordEmail = (req, res) => {
        verification_code = randomstring.generate({ length: 4, charset: 'numeric' });
        const body = req.body;
        const email = body.email;
        if (email) {
            User
                .findOne({
                    where: {
                        email,
                    },
                })
                .then((user) => {

                    if (!user) {
                        const errorMsg = {
                            status: false,
                            msg: 'Bad Request ! User Not Found'
                        }
                        res.send(errorMsg);
                    }
                    else {
                        const body = req.body;
                        const verification_Code = "Your Code:" + verification_code;
                        var helper = require('sendgrid').mail;
                        const fromEmail = new helper.Email("no_reply@reactivespace.com");
                        const toEmail = new helper.Email(body.email);
                        const subject = 'Etherin Cash Forgot Password Link';
                        const content = new helper.Content('text/plain', verification_Code);
                        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

                        const sg = require('sendgrid')(process.env.API_KEY);

                        const request = sg.emptyRequest({
                            method: 'POST',
                            path: '/v3/mail/send',
                            body: mail.toJSON()
                        });

                        sg.API(request, function (error, response) {
                            if (error) {
                                console.log('Error response received');
                                return res.status(response.statusCode).json({ Error: response.headers });
                            }

                            timer = 0;
                            //Countdown for verification link...
                            var t = d3.timer(function (elapsed) {
                                //console.log(elapsed);
                                if (elapsed > 900000) {
                                    timer = 15;
                                    t.stop();
                                }
                            }, 150);

                            res.status(response.statusCode).json({ status: true, msg: 'Verification Code Has Been Sent' });
                        });

                    }
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ msg: 'Internal server error' });
                });
        } else {
            const errorRes = {
                status: false,
                msg: "Error! Please Check Parameters"
            }
            res.send(errorRes);
        }


    };



    //Verification Code For Forget Password
    const verificationCode = (req, res) => {
        const body = req.body;
        if (body.vcode === verification_code) {
            res.status(200).json({ status: true, msg: 'Code Verified' });
        } else {
            const error = {
                status: false,
                msg: "Wrong Code"
            }
            res.send(error);
        }
    }
    //change Password When User Forget Their Password
    const resetPassword = (req, res) => {
        const body = req.body;
        const salt = bcrypt.genSaltSync();
        const hashPassword = bcrypt.hashSync(body.newPassword, salt);
        if (body.vemail) {
            return User
                .update({
                    password: hashPassword,
                }, {
                        where: {
                            email: body.vemail
                        }
                    })
                .then((user) => {
                    if (user == 1) {
                        const success = {
                            status: true,
                            msg: 'Successfull',
                        }
                        res.send(success);
                    } else {
                        const error = {
                            status: false,
                            msg: 'Error! Password Not Changed'
                        }
                        res.send(error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).json({ msg: "Bad server response.Please Contact your service provider." })
                })
        } else {
            const errorRes = {
                status: false,
                msg: "Error! Please Check Parameters"
            }
            res.send(errorRes);
        }

    }

    //Get By Email ID
    const getByEmail = (req, res) => {
        User
            .findOne({ where: { email: req.params.email } })
            .then((user) => res.status(200).json({ user }))
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ msg: 'Internal server error' });
            });
    }

    // const getAll = (req, res) => {
    //     User
    //         .findAll()
    //         .then((users) => res.status(200).json({ users }))
    //         .catch((err) => {
    //             console.log(err);
    //             return res.status(500).json({ msg: 'Internal server error' });
    //         });
    // };
    //Upload Profile Image Link
    const keyStore = (req, res) => {
        const body = req.body;
        if (body.email && body.keyStore) {
            User
                .findOne({
                    where: {
                        email: body.email
                    }
                })
                .then((user) => {
                    if (user.keyStore == null) {
                        return User
                            .update({
                                keyStore: body.keyStore
                            }, {
                                    where: { email: body.email }
                                })
                            .then((updateKeyStore) => {
                                res.send({
                                    status: true,
                                    msg: 'Successfully Added KeyStore'
                                })
                            })
                            .catch((error) => {
                                res.send({
                                    status: false,
                                    msg: error.message
                                })
                            })
                    }
                    else {
                        const error = {
                            status: false,
                            msg: "Error! Already Exist KeyStore"
                        }
                        res.send(error);
                    }
                }).catch((error) => {
                    console.log(error);
                    const updateError = {
                        status: false,
                        msg: "Bad server response.Please Contact your service provider"
                    }
                    res.send(updateError);
                })
        } else {
            const error = {
                status: false,
                msg: "Error! Please check Parameters"
            }
            res.send(error);
        }
    }
    //Update User Status
    updateuserstatus = (req, res) => {
        const body = req.body;
        return User
            .update({
                status: body.status
            },
                {
                    where: {
                        email: body.email
                    }
                }
            ).then((user) => {

                return res.status(200).json({ user });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ msg: 'Internal server error' });
            });
    }
    //Upload Profile Image Link
    const uploadImage = (req, res) => {
        const body = req.body;
        if (body.email && body.profileImage) {
            return User
                .update({
                    profileImage: body.profileImage
                }
                    , {
                        where: {
                            email: body.email
                        }
                    })
                .then((updateStatus) => {
                    if (updateStatus) {
                        const result = {
                            status: true,
                            msg: "Successfully added Image"
                        }
                        res.send(result);
                    }
                    else {
                        const error = {
                            status: false,
                            msg: "Error! to Adding Image"
                        }
                        res.send(error);
                    }
                }).catch((error) => {
                    console.log(error);
                    const updateError = {
                        status: false,
                        msg: "Bad server response.Please Contact your service provider"
                    }
                    res.send(updateError);
                })
        } else {
            const error = {
                status: false,
                msg: "Error! Please check Parameters"
            }
            res.send(error);
        }
    }

    //get user by id 
    getbyid = (req, res) => {
        return User
            .find({
                where: { id: req.params.id }
            }).then((user) => {
                return res.status(200).json({ user });
            }).catch((error) => {
                return res.status(500).json({ msg: 'internal server error' });
            });
    }
    // update password 
    const changePassword = (req, res) => {
        const body = req.body;
        User
            .findOne({ where: { email: req.body.email } })
            .then((user) => {
                console.log(user.password);
                if (bcryptService.comparePassword(body.oldPassword, user.password)) {
                    const salt = bcrypt.genSaltSync();
                    const hashPassword = bcrypt.hashSync(body.newPassword, salt);
                    return User
                        .update({
                            password: hashPassword,
                        }, {
                                where: {
                                    email: req.body.email
                                }
                            })
                        .then((user) => {

                            return res.status(200).json({ user });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json({ msg: 'Internal server error' });
                        });
                }
                else {
                    return res.status(202).json({ msg: 'Incorrect Old Password' });
                }
                res.status(200).json({ user });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ msg: 'Internal server error' });
            });
    }

    //ALL USER 

    const totalUser = (req, res) => {
        User
            .count({
                where: { role: "user" }
            })
            .then((totalUsers) => res.status(200).json({ totalUsers }))
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ msg: 'Internal server error' });
            });
    }
    
        
    const testSMS = (req, res) => {
        const test_code = randomstring.generate({ length: 4, charset: 'numeric' });
        const body = req.body;
        client.messages.create({
            to: body.phoneNumber,
            from: '+19403108218',
            body: test_code + '/t This is Test Api For SMS'
        })
            .then((SMS) => {
                res.send({
                    status: true,
                    msg: 'Message Has Been Sent',
                    result: SMS
                })
            })
            .catch((error) => {

                res.send({
                    status: false,
                    msg: error.message
                });

            });
    }
    const testVoice = (req, res) => {
        // const test_code = randomstring.generate({ length: 4, charset: 'numeric' });
        const body = req.body;
        client.calls.create({
            url:'https://demo.twilio.com/welcome/voice/',
            to: body.phoneNumber,
            from: '+19403108218',
            // body: test_code + '/t This is Test Api For SMS'
        })
            .then((calls) => {
                res.send({
                    status: true,
                    msg: 'Message Has Been Sent',
                    result: calls
                })
            })
            .catch((error) => {

                res.send({
                    status: false,
                    msg: error.message
                });

            });
    }
    //Send Email test 
    const sendEmailtest = (req, res) => {
        const body = req.body;
        console.log("BODY:",body);
        // using SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        // const sgMail = require('@sendgrid/mail')(process.env.API_KEY);
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: body.email,
            from: 'test@example.com',
            subject: 'Testing . . .',
            text: 'Welcome To the Testing Phase of sending Email',
            html: "",
        };
        sgMail.send(msg)
            .then((email) => {
                res.send({
                    status: true,
                    msg: "Email Successfully Sent !",
                    data: email
                })
            })
            .catch((error) => {
                res.send({
                    status: false,
                    // msg:"Unable To Send Email !",
                    msg: error.message
                })
            })


    }

    // return {
    //     register,
    //     login,
     //  getAll
       //,
    //     sendforgotPasswordEmail,
    //     sendResetPasswordEmail,
    //     getByEmail,
    //     updateuserstatus,
    //     getbyid,
    //     changePassword,
    //     totalUser,
    //     verifyEmail,
    //     verificationCode,
    //     resetPassword,
    //     sendEmailforVerification,
    //     uploadImage,
    //     keyStore,
    //     resendVerificationEmail,
    //     testSMS,
    //     testVoice,
    //     sendEmailtest
    // };
};

module.exports = UserController;
