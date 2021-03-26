const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/auth");



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
        "/api/driver/send-otp",
        controller.sendOTP,
    );

    // //------------driver create contect-us  Function----------------
    app.post(
        "/api/driver/varify-otp",
        controller.varify_otp,
    );



}