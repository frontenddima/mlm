module.exports = {
    // // user routes
    // 'POST /user/Register': 'UserController.register',//Used In App
    // 'POST /user/login': 'UserController.login',     //Used in App
    // 'POST /user/verificationEmailSend': 'UserController.sendEmailforVerification',//Send Emial Verification For EtherIn Cash App
    // 'POST /user/resendVerificationEmail': 'UserController.resendVerificationEmail',//Send Emial Verification For EtherIn Cash App    
    // 'POST /user/resetPasswordEmail': 'UserController.sendResetPasswordEmail',
    // 'POST /user/forgotPasswordEmail': 'UserController.sendforgotPasswordEmail',//For App
    // 'POST /user/verifyCode': 'UserController.verificationCode',//For App
    // 'POST /user/resetForgetPassword': 'UserController.resetPassword',//For App
    // 'POST /user/uploadProfileImage': 'UserController.uploadImage',//For App
    // 'POST /user/keyStore': 'UserController.keyStore',//For App
    // 'GET /user/verifyEmail/:email/:token': 'UserController.verifyEmail',
    // 'GET /user/getByEmail/:email' : 'UserController.getByEmail',
    // 'GET  /user/allusers' : 'UserController.getAll',
    // 'POST  /user/updatestatus': 'UserController.updateuserstatus',
    // 'GET /user/getuserbyid/:id': 'UserController.getbyid',
    // 'POST /user/resetpassword' : 'UserController.changePassword',
    // 'GET /user/usercount' : 'UserController.totalUser',
    // // 'GET  /user/getRandomNuber' : 'UserController.randomNumber',
    // 'POST /user/sendEmailtest':'UserController.sendEmailtest',
    // 'POST /user/testSMS':'UserController.testSMS',
    // 'POST /user/testVoice':'UserController.testVoice',
    // 'GET /CallsLog/GetCallsLog':'callsLogController.GetCallsLog',
    // 'POST /CallsLog/AddCallsLog':'callsLogController.AddCallsLog',
    // 'GET/testUsers':'usersController.GetCallsLog',
    'GET/Transactions':'TransactionsController.GetCallsLog',
    'GET/Referral':'ReferralController.GetCallsLog',
    'GET/Bonuses':'BonusesController.GetCallsLog',
   'POST /Users':'UsersController.newUserRegistration',
   'POST /loginUser':'usersController.loginUser',  
    'GET /test':'UsersController.test',
    
 
    
};