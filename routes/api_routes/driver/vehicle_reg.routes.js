const { driverVerifyNumberPlate } = require("../../../middleware");
const { driverAuthJwt } = require("../../../middleware");
const fileUpload = require('express-fileupload');
const controller = require("../../../controllers/api_controllers/driver.controller");



module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });





    //------------Driver Create Vehicle register Function----------------
    app.post(
        "/api/driver/create-vehicle",
     driverVerifyNumberPlate.checkDuplicatePlate,
        driverAuthJwt.verifyToken,
        (req,res,next)=>{
            var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/driver/';
            //-----------------move vehicle document into server-------------------------------//
            req.files.vehicle_document.mv(path_file + '' + req.files.vehicle_document.name, function (err) {
                if (err) console.log("error occured");
            });
            //-----------------move frint_image into server-------------------------------//
            req.files.frint_image.mv(path_file + '' + req.files.frint_image.name, function (err) {
                if (err) console.log("error occured");
            });
            //-----------------move back_image into server-------------------------------//
            req.files.back_image.mv(path_file + '' + req.files.back_image.name, function (err) {
                if (err) console.log("error occured");
            });
            return next();
        },
       controller.create_vehicle_reg

    );

 //------------Get driver all vehicles from admin Function----------------
    app.get(
        "/api/driver/all-vehicles",
        driverAuthJwt.verifyToken,
        controller.get_all_vehicles
    )

//  //------------Vendor Delete address Function----------------
//  app.post(
//     "/api/vendor/delete-address",
//     // vendorAuthJwt.verifyToken,
//     // controller.delete_address
// )


};
