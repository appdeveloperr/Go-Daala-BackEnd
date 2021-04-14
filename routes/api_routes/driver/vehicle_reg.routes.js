const { driverVerifyNumberPlate } = require("../../../middleware");
const { driverAuthJwt } = require("../../../middleware");
const fileUpload = require('express-fileupload');
const controller = require("../../../controllers/api_controllers/driver/vehicle_reg");



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


      //------------Driver update Vehicle if driver register Function----------------
      app.post(
        "/api/driver/update-vehicle",
    driverVerifyNumberPlate.checkDuplicatePlate,
     driverAuthJwt.verifyToken,
       controller.update_vehicle_reg

    );


 //------------Get driver all vehicles from admin Function----------------
    app.get(
        "/api/driver/all-vehicles",
        // driverAuthJwt.verifyToken,
        controller.get_all_vehicles
    )



};
