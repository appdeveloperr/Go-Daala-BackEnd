
const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/trip");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //------------driver receive trip Function----------------
    app.post(
        "/api/driver/receive-trip",
        // driverAuthJwt.verifyToken,
        controller.receive_trip,
    );

    //------------driver cencal trip Function----------------
    app.post(
        "/api/driver/cencal-trip",
        driverAuthJwt.verifyToken,
        controller.cencal_trip,
    );

    //------------driver start trip Function----------------
    app.post(
        "/api/driver/start-trip",
        driverAuthJwt.verifyToken,
        controller.start_trip,
    );


    //------------driver end trip Function----------------
    app.post(
        "/api/driver/end-trip",
        driverAuthJwt.verifyToken,
        controller.end_trip,
    );


    //------------driver Get  all  Trip  Function----------------
    app.post(
        "/api/driver/get-all-trips",
        // driverAuthJwt.verifyToken,
        controller.get_all_trips,
    );


    //------------driver all cencal trip Function----------------
    app.post(
        "/api/driver/all-cancel-trip",
        // vendorAuthJwt.verifyToken,
        controller.all_cancel_trip,
    );


};