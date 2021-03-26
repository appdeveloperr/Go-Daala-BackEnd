const { driverVerifyNumberPlate } = require("../../../middleware");
const { driverAuthJwt } = require("../../../middleware");
const fileUpload = require('express-fileupload');
const controller = require("../../../controllers/api_controllers/driver/faq");



module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });




//  //------------ get driver all FAQ'S Function----------------
 app.get(
    "/api/driver/faqs/index",
    driverAuthJwt.verifyToken,
        controller.get_all_faqs
)


};
