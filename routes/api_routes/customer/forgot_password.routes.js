const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/auth");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    //------------customer forgot password  Function----------------
    app.post(
        "/api/customer/forgot-password",
        controller.forgot_password,

    );



//  //------------customer Update address Function----------------
//     app.post(
//         "/api/customer/update-address",
//         customerAuthJwt.verifyToken,
//         controller.update_address
//     )

//  //------------customer Delete address Function----------------
//  app.post(
//     "/api/customer/delete-address",
//     customerAuthJwt.verifyToken,
//     controller.delete_address
// )


};
