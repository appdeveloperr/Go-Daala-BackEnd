const controller = require("../../../controllers/api_controllers/customer/contectus");
const { customerAuthJwt } = require("../../../middleware");
module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



         // //------------customer create contect-us  Function----------------
         app.post(
            "/api/customer/create-contect_us",
            customerAuthJwt.verifyToken,
            controller.contect_us,
        );
    
    
        app.post(
            "/api/customer/get-reply",
            customerAuthJwt.verifyToken,
            controller.get_reply,
        );
}