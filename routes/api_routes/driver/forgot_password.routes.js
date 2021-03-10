const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver.controller");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    //------------Vendor forgot password  Function----------------
    app.post(
        "/api/driver/forgot-password",
        controller.forgot_password,

    );

    // //------------driver create contect-us  Function----------------
    app.post(
        "/api/driver/create-contect_us",
        driverAuthJwt.verifyToken,
        controller.contect_us,
    );


    //     //------------driver Create trip Function----------------
    //     app.post(
    //         "/api/driver/recent-trip",
    //         driverAuthJwt.verifyToken,
    //         controller.recent_trip,
    //     );
}