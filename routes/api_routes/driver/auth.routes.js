const { driverVerifySignUp } = require("../../../middleware");
const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver.controller");
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
        "/api/driver/signupdriver", driverVerifySignUp.checkDuplicateEmailOrPhone_number, (req, res, next) => {
            var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/vendor/';
            //-----------------move profile into server-------------------------------//
            req.files.profile.mv(path_file + '' + req.files.profile.name, function (err) {
                if (err) console.log("error occured");
            });
            //-----------------move cnic into server-------------------------------//
            req.files.cnic.mv(path_file + '' + req.files.cnic.name, function (err) {
                if (err) console.log("error occured");
            });
            //-----------------move driving_license into server-------------------------------//
            req.files.driving_license.mv(path_file + '' + req.files.driving_license.name, function (err) {
                if (err) console.log("error occured");
            });
            return next();
        },
        controller.signup
    );



    app.post("/api/driver/signin", controller.signin);
    app.post('/api/driver/update-profile',
        driverAuthJwt.verifyToken, (req, res, next) => {
            console.log('this is updated')
            if (!req.files) {
                return next();

            } else {
                var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/vendor/';
                //-----------------move profile into server-------------------------------//
                req.files.profile.mv(path_file + '' + req.files.profile.name, function (err) {
                    if (err) console.log("error occured");
                    return next();
                });

            }
            return next();
        },
        controller.update);

};
