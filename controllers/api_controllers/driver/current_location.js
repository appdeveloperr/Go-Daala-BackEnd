const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Dirver_lat_long = db.driver_lat_long;

//--------------driver current location ----------------------
exports.current_location = (req, res) => {
    req.checkBody('latitude', 'latitude must have needed!').notEmpty();
    req.checkBody('longitude', 'longitude must have needed!').notEmpty();
    req.checkBody('driver_id', 'driver_id must have required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in  driver current  location",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Dirver_lat_long.create({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            driver_id: req.body.driver_id


        }).then(driver_lat => {
            if (driver_lat) {
                return res.status(200).send({
                    status: 200,
                    message: "Driver current location is successfuly submeitted",
                    successData: {
                        driver_lat_long: {
                            latitude: driver_lat.latitude,
                            longitude: driver_lat.longitude,
                            driver_id: driver_lat.driver_id
                        }
                    }
                });
            }
        }).catch(err => {

            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: {}
            });

        });
    }

}
