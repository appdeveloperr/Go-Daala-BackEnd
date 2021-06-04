const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/trip");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    app.get("/api/customer/testing",
        // customerAuthJwt.verifyToken,
        controller.test);




    //------------Vendor Create trip Function----------------
    app.post(
        "/api/customer/create-trip",
        // customerAuthJwt.verifyToken,
        controller.create_trip

        // uploads.single('profile'),
    );
    //--------------vendor recent all trip---------------------------//get_all_trips
    app.post(
        "/api/customer/get-all-trips",
      //  customerAuthJwt.verifyToken,
         controller.get_all_trips,
    );


    //--------------vendor fair_calculation  trip---------------
    app.post(
        "/api/customer/fair-calculation",
       // customerAuthJwt.verifyToken,
        controller.fair_calculation
    )

  //------------vendor trip_detail  trip Function----------------
  app.post(
    "/api/customer/trip-detail",
    //customerAuthJwt.verifyToken,
    controller.trip_detail
)

  //------------vendor share trip to another person Function----------------
   app.post(
       "/api/customer/trip-share",
       customerAuthJwt.verifyToken,
       controller.trip_share
   )

    //------------vendor cencal trip Function----------------
    app.post(
        "/api/customer/cancel-trip",
        // customerAuthJwt.verifyToken,
        controller.cancel_trip,
    );





    //------------vendor all cencal trip Function----------------
    app.post(
        "/api/customer/all-cancel-trip",
        // customerAuthJwt.verifyToken,
        controller.all_cancel_trip,
    );


    //------------vendor all ongoing trip Function----------------
    app.post(
        "/api/customer/all-ongoing-trip",
        // customerAuthJwt.verifyToken,
        controller.all_ongoing_trip,
    );


    app.get('/api/customer/test', controller.test_lat_log);







};
