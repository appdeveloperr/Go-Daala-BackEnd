const { vendorVerifySignUp } = require("../../../middleware");
const { vendorAuthJwt } = require("../../../middleware");

const controller = require("../../../controllers/api_controllers/vendor.controller");
const multer = require('multer');
var path = require('path');


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // // SET STORAGE
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, './public/files/uploadsFiles/vendor/')
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //     }
    // });

    // const fileFilter = (req, file, cb) => {
    //     console.log(file);
    //     if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //     }
    // }

    // const uploads = multer({ storage: storage, fileFilter: fileFilter });




    app.post(
        "/api/vendor/signup",
        vendorVerifySignUp.checkDuplicateEmailOrPhone_number,
        // uploads.single('profile'),
        controller.signup
    );

    app.post("/api/vendor/signin", controller.signin);
    app.post('/api/vendor/update-profile',
    vendorAuthJwt.verifyToken,
    controller.update);

};
