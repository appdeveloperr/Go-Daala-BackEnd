const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor/trip");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });








    //------------Vendor Create trip Function----------------
    app.post(
        "/api/vendor/create-trip",
        vendorAuthJwt.verifyToken,
        controller.create_trip,

        // uploads.single('profile'),
    );
//--------------vendor recent all trip---------------------------//
    app.post(
        "/api/vendor/recent-trip",
        vendorAuthJwt.verifyToken, controller.recent_trip,
    );

//------------vendor cencal trip Function----------------
   app.post(
    "/api/vendor/cencal-trip",
    vendorAuthJwt.verifyToken,
    controller.cencal_trip,
); 

    app.get('/api/vendor/test', controller.test_lat_log);







};
