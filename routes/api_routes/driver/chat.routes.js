const { driverAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/driver/chat");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



   //------------driver get chat Function----------------
   app.post(
    "/api/driver/get-chat",
    driverAuthJwt.verifyToken,
    controller.get_chat
);


}