const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/product");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

      //  //------------ get customer all product Function----------------
      app.get(
        "/api/customer/get-all-product",
        // customerAuthJwt.verifyToken, 
        controller.get_all_product,

    );

        //------------customer get single product Function----------------
      app.get(
        "/api/customer/get-single-product",
        // customerAuthJwt.verifyToken, 
        controller.get_single_product,

    );


       //------------customer get recent product Function----------------
       app.get(
        "/api/customer/get-recent-product",
        // customerAuthJwt.verifyToken, 
        controller.get_recent_product,

    );
}