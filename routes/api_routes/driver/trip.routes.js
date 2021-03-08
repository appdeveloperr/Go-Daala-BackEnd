
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

    //------------driver Create trip Function----------------
    app.post(
        "/api/driver/create-trip",
        driverAuthJwt.verifyToken,
        controller.create_trip,
    );


        //------------driver Create trip Function----------------
        app.post(
            "/api/driver/recent-trip",
            driverAuthJwt.verifyToken,
            controller.recent_trip,
        );




};
