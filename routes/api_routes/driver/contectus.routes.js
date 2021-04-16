const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/contectus");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



       //------------driver recent trip Function----------------
       app.post(
        "/api/driver/contact_us",
        driverAuthJwt.verifyToken,
        controller.contact_us
    );


    app.post(
        "/api/driver/get-reply",
        // driverAuthJwt.verifyToken,
        controller.get_reply,
    );
}