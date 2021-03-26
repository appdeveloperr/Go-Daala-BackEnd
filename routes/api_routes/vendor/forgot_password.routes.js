const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor/auth");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    //------------Vendor forgot password  Function----------------
    app.post(
        "/api/vendor/forgot-password",
        controller.forgot_password,

    );



//  //------------Vendor Update address Function----------------
//     app.post(
//         "/api/vendor/update-address",
//         vendorAuthJwt.verifyToken,
//         controller.update_address
//     )

//  //------------Vendor Delete address Function----------------
//  app.post(
//     "/api/vendor/delete-address",
//     vendorAuthJwt.verifyToken,
//     controller.delete_address
// )


};
