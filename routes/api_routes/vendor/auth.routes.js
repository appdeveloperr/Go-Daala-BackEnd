const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor.controller");
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
        "/api/vendor/signup",
        vendorVerifySignUp.checkDuplicateEmailOrPhone_number, (req, res, next) => {
            var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/vendor/' + req.files.profile.name;
            req.files.profile.mv(path_file, function (err) {
                if (err) console.log("error occured");
            });
            return next();
        }, controller.signup);


    app.post("/api/vendor/signin", controller.signin);
    app.post('/api/vendor/update-profile',
        vendorAuthJwt.verifyToken,
        controller.update);

};
