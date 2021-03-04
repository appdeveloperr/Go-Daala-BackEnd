const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor.controller");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });




    // app.post("/api/vendor/signin", controller.signin);
    // app.post('/api/vendor/update-profile',
    //     vendorAuthJwt.verifyToken,
    //     controller.update);



    //------------Vendor Create address Function----------------
    app.post(
        "/api/vendor/create-address",
        // vendorVerifySignUp.checkDuplicateLatitudeOrLongitude,
        vendorAuthJwt.verifyToken,
        controller.create_address,

        // uploads.single('profile'),
    );

 //------------Vendor Update address Function----------------
    app.post(
        "/api/vendor/update-address",
        vendorAuthJwt.verifyToken,
        controller.update_address
    )

 //------------Vendor Delete address Function----------------
 app.post(
    "/api/vendor/delete-address",
    vendorAuthJwt.verifyToken,
    controller.delete_address
)


};
