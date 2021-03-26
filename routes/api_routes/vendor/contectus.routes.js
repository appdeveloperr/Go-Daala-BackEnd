const controller = require("../../../controllers/api_controllers/vendor/contectus");
const { vendorAuthJwt } = require("../../../middleware");
module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



         // //------------vendor create contect-us  Function----------------
         app.post(
            "/api/vendor/create-contect_us",
            vendorAuthJwt.verifyToken,
            controller.contect_us,
        );
    
    
        app.post(
            "/api/vendor/get-reply",
            vendorAuthJwt.verifyToken,
            controller.get_reply,
        );
}