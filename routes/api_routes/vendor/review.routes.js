const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor/review");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    

    app.post('/api/vendor/review-create',
    //  vendorAuthJwt.verifyToken,
      controller.create_review
    );

    app.post('/api/vendor/get-review',
    //  vendorAuthJwt.verifyToken,
     controller.get_review
   );

}