const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor/faq");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

      //  //------------ get vendor all FAQ'S Function----------------
      app.get(
        "/api/vendor/faqs/index",
        vendorAuthJwt.verifyToken, controller.get_all_faqs,

    );
}