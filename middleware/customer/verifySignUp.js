const { customer } = require("../../models/api_models");
const db = require("../../models/api_models");
const ROLES = db.ROLES;
const Customer = db.customer;
const Address = db.address;
checkDuplicateEmailOrPhone_number = (req, res, next) => {

  req.checkBody('email', 'email must have value!').notEmpty();
  req.checkBody('phone_number', 'phone number must have value!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(200).send({
      status: 400,
      message: "validation  error in Signing Up",
      successData: {
        error: {
          error: errors
        }
      }
    });
  } else {
    Customer.findOne({
      where: {
        email: req.body.email
      }
    }).then(customer => {
      if (customer) {
        return res.status(200).send({
          status: 400,
          message: "Failed! customer email is already in use!",
          successData: {
          }

        });

      }

      // Email
      Customer.findOne({
        where: {
          phone_number: req.body.phone_number
        }
      }).then(customer => {
        if (customer) {


          return res.status(200).send({
            status: 400,
            message: "Failed! customer Phone Number is already in use!",
            successData: {
            }

          });


        }

        next();
      });
    });
  }

};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};

checkDuplicateLatitudeOrLongitude = (req, res, next) => {
  Address.findOne({
    where: {
      latitude: req.body.latitude
    }
  }).then(address => {
    if (address) {
      return res.status(200).send({
        status: 400,
        message: "Failed! Latitude is already in use!",
        successData: {
        }

      });

    }

    // Email
    Address.findOne({
      where: {
        longitude: req.body.longitude
      }
    }).then(address => {
      if (address) {


        return res.status(200).send({
          status: 400,
          message: "Failed! Longitude is already in use!",
          successData: {
          }

        });


      }

      next();
    });
  });
}

const verifySignUp = {
  checkDuplicateEmailOrPhone_number: checkDuplicateEmailOrPhone_number,
  checkDuplicateLatitudeOrLongitude: checkDuplicateLatitudeOrLongitude,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
