const { adminVerifySignUp } = require("../../../middleware");
const { adminAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/admin/auth");
// const multer = require('multer');
var path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });






    app.post(
        "/api/admin/signup",
        adminVerifySignUp.checkDuplicateEmailOrPhone_number,controller.signup);

        app.post(
            "/api/admin/verify-email-and-phone-number", controller.varify_email_and_phone_number
        )


    app.post("/api/admin/signin", controller.signin);
    app.post('/api/admin/update-profile',
        adminAuthJwt.verifyToken,
        controller.update);


        app.post('/api/admin/update-picture',
        adminAuthJwt.verifyToken,
        controller.update_picture
        )

};
