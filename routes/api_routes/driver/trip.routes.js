
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

    //------------driver receive trip Function----------------
    app.post(
        "/api/driver/receive-trip",
        driverAuthJwt.verifyToken,
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


    //------------driver recent trip Function----------------
    app.post(
        "/api/driver/recent-trip",
        driverAuthJwt.verifyToken,
        controller.recent_trip,
    );


    //------------driver recent trip Function----------------
        app.post(
            "/api/driver/contact_us",
            driverAuthJwt.verifyToken,
            controller.contact_us
        );


          //------------driver current location Function----------------
          app.post(
            "/api/driver/current-location",
            driverAuthJwt.verifyToken,
            controller.current_location,
        );

};
