const controller = require("../../../controllers/api_controllers/vendor.controller");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    //------------driver send otp  Function----------------
    app.post(
        "/api/vendor/send-otp",
        controller.sendOTP,
    );

    // //------------driver create contect-us  Function----------------
    app.post(
        "/api/vendor/varify-otp",
        controller.varify_otp,
    );


    //     //------------driver Create trip Function----------------
    //     app.post(
    //         "/api/driver/recent-trip",
    //         driverAuthJwt.verifyToken,
    //         controller.recent_trip,
    //     );
}