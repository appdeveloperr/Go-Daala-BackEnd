const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/chat");



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
        "/api/customer/get-chat",
        customerAuthJwt.verifyToken,
        controller.get_chat
    );


};
