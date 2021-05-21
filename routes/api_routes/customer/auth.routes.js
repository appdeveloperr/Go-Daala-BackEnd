const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/auth");
// const multer = require('multer');
// var path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

module.exports = function (app) {
    app.use(fileUpload());

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.post(
        "/api/customer/signup",
        controller.signup
        );

        app.post(
            "/api/customer/verify-email-and-phone-number",
             controller.varify_email_and_phone_number
        )


    app.post("/api/customer/signin", controller.signin);
    app.post('/api/customer/update-profile',
       customerAuthJwt.verifyToken,
        controller.update);


        app.post('/api/customer/update-picture',
        customerAuthJwt.verifyToken,
        controller.update_picture
        )

};
