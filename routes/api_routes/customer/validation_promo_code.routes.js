const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/promo");

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/customer/validate-promo-code",
    //   vendorAuthJwt.verifyToken,
        controller.validate_promo_code,
    );

  
    
    };
    