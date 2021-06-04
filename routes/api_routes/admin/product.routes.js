const { adminVerifySignUp } = require("../../../middleware");
const { adminAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/admin/product");
// const multer = require('multer');
// var path = require('path');
var path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });



    app.post(
        "/api/admin/product-create",
        controller.product_create);

        app.post(
            "/api/admin/product-update", 
            controller.product_update
        )


    app.post("/api/admin/product-delete", 
    controller.product_delete);
    
    app.post('/api/admin/all-product',
        controller.product_index);

    app.post('/api/admin/product-details',
        controller.product_details);
};
