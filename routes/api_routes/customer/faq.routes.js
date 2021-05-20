const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/faq");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

      //  //------------ get customer all FAQ'S Function----------------
      app.get(
        "/api/customer/faqs/index",
        customerAuthJwt.verifyToken, 
        controller.get_all_faqs,

    );
}