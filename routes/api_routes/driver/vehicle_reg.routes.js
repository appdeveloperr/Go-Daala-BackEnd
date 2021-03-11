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
       controller.create_vehicle_reg

    );

 //------------Get driver all vehicles from admin Function----------------
    app.get(
        "/api/driver/all-vehicles",
        driverAuthJwt.verifyToken,
        controller.get_all_vehicles
    )

//  //------------ get driver all FAQ'S Function----------------
 app.get(
    "/api/driver/faqs/index",
    driverAuthJwt.verifyToken,
        controller.get_all_faqs
)


};
