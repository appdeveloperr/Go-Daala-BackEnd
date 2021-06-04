const { customerVerifySignUp } = require("../../../middleware");
const { customerAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/customer/address");



module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });








    //------------Customer Create address Function----------------
    app.post(
        "/api/customer/create-address",
        customerAuthJwt.verifyToken,
        controller.create_address,
    );

 //------------Customer Update address Function----------------
    app.post(
        "/api/customer/update-address",
        customerAuthJwt.verifyToken,
        controller.update_address
    )

 //------------Customer Delete address Function----------------
 app.post(
    "/api/customer/delete-address",
    customerAuthJwt.verifyToken,
    controller.delete_address
);

 //------------Customer index address Function----------------
app.post(
    "/api/customer/index-address",
    customerAuthJwt.verifyToken,
    controller.index_address
)

};
