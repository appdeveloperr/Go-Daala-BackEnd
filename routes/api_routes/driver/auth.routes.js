const { driverVerifySignUp } = require("../../../middleware");
const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/auth");
const multer = require('multer');
var path = require('path');
// const fileUpload = require('express-fileupload');
// const fs = require('fs');

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    app.post(
        "/api/driver/signupdriver",
		driverVerifySignUp.checkDuplicateEmailOrPhone_number,
		controller.signup);


    app.post(
        "/api/driver/verify-email", controller.varify_email
    )

    app.post("/api/driver/verify-phone-number",controller.varify_phone_number);


    
    app.post("/api/driver/signin", controller.signin);

    
    app.post('/api/driver/update-profile',
        driverAuthJwt.verifyToken, 
        controller.update);


    app.post('/api/driver/update-picture',
    driverAuthJwt.verifyToken, 
    controller.update_picture
    )
    
    app.post('/api/driver/active-status',
   
    controller.active_status
    )


    app.post('/api/driver/unactive-status',
   
    controller.unactive_status
    )
};
