const db = require("../../models/api_models");
const ROLES = db.ROLES;
const Vendor = db.vendor;
const Vehicle_reg = db.vehicle_reg;
checkDuplicatePlate = (req, res, next) => {
  req.checkBody('number_plate', 'number plate  must have value!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(200).send({
      status: 400,
      message: "validation error in Vehicle register",
      successData: {
        error: {
          error: errors
        }
      }
    });
  } else {
    Vehicle_reg.findOne({
      where: {
        number_plate: req.body.number_plate
      }
    }).then(vehicle_reg => {
      if (vehicle_reg) {
        return res.status(200).send({
          status: 400,
          message: "Failed! this number plate is already in use!",
          successData: {
          }
        });

      }
      next();
    });
  }

};





const driverVerifyNumberPlate = {
  checkDuplicatePlate
}

module.exports = driverVerifyNumberPlate;
