const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/review");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    app.post('/api/driver/review-create',
    // driverAuthJwt.verifyToken,
    controller.create_review
    );

    app.post('/api/driver/get-review',
    //  driverAuthJwt.verifyToken,
     controller.get_review
   );
}