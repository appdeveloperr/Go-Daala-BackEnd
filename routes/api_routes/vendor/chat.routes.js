const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor/chat");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    //------------Vendor get chat Function----------------
    app.post(
        "/api/vendor/get-chat",
        vendorAuthJwt.verifyToken,
        controller.get_chat
    );


};
