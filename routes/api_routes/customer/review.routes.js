const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/review");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    

    app.post('/api/customer/review-create',
      customerAuthJwt.verifyToken,
      controller.create_review
    );

    app.post('/api/customer/get-review',
     customerAuthJwt.verifyToken,
     controller.get_review
   );

}