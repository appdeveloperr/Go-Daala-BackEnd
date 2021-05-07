
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
        //driverAuthJwt.verifyToken,
        controller.receive_trip
    );

    //------------driver trip_detail  trip Function----------------
    app.post(
        "/api/driver/trip-detail",
        // driverAuthJwt.verifyToken,
        controller.trip_detail
    )

    //------------driver fair-calculation  trip Function----------------
    app.post(
        "/api/driver/fair-calculation",
        // driverAuthJwt.verifyToken,
        controller.fair_calculation
    )
    //------------driver cencal trip Function----------------
    app.post(
        "/api/driver/cencal-trip",
        // driverAuthJwt.verifyToken,
        controller.cencal_trip,
    );

    //------------driver start trip Function----------------
    app.post(
        "/api/driver/start-trip",
        //  driverAuthJwt.verifyToken,
        controller.start_trip,
    );


    //------------driver end trip Function----------------
    app.post(
        "/api/driver/end-trip",
        //  driverAuthJwt.verifyToken,
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
        // driverAuthJwt.verifyToken,
        controller.all_cancel_trip,
    );


 
    //------------driver all trips with total cash  Function----------------
    app.post(
        "/api/driver/get-all-trips-with-cash",
       // driverAuthJwt.verifyToken,
        controller.get_all_trips_with_cash,
    );


    


    //------------driver get_selected_date_with_cash   Function----------------
    app.post(
        "/api/driver/get-selected-date-with-cash",
        //driverAuthJwt.verifyToken,
        controller.get_selected_date_with_cash,
    );

};

