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



app.get("/api/vendor/testing",
// vendorAuthJwt.verifyToken,
controller.test);




    //------------Vendor Create trip Function----------------
    app.post(
        "/api/vendor/create-trip",
        // vendorAuthJwt.verifyToken,
        controller.create_trip

        // uploads.single('profile'),
    );
//--------------vendor recent all trip---------------------------//
    app.post(
        "/api/vendor/recent-trip",
        vendorAuthJwt.verifyToken, controller.recent_trip,
    );

//------------vendor cencal trip Function----------------
   app.post(
    "/api/vendor/cancel-trip",
    // vendorAuthJwt.verifyToken,
    controller.cancel_trip,
); 



//------------vendor all cencal trip Function----------------
app.post(
    "/api/vendor/all-cancel-trip",
    // vendorAuthJwt.verifyToken,
    controller.all_cancel_trip,
); 


//------------vendor all ongoing trip Function----------------
app.post(
    "/api/vendor/all-ongoing-trip",
    // vendorAuthJwt.verifyToken,
    controller.all_ongoing_trip,
); 


    app.get('/api/vendor/test', controller.test_lat_log);







};
