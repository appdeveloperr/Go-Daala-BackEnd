
const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/current_location");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });





          //------------driver current location Function----------------
          app.post(
            "/api/driver/current-location",
            // driverAuthJwt.verifyToken,
            controller.current_location,
        );

     

     


};
