const db = require("../../models/api_models");
const ROLES = db.ROLES;
const Driver= db.driver;
const Address = db.address;
checkDuplicate = (req, res, next) => {
  req.checkBody('email', 'email must have value!').notEmpty();
  req.checkBody('phone_number', 'phone number must have value!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(200).send({
      status: 400,
      message: "validation error in Signing Up",
      successData: {
        error: {
          error: errors
        }
      }
    });
  } else {
    //------------------if email is same  --------------------------------
    console.log("email: ", req.body.email);
    Driver.findOne({
      where: {
        email: req.body.email
      }
    }).then(driver => {
      if (driver) {
        return res.status(200).send({
          status: 400,
          message: "Failed! email is already in use!",
          successData: {
          }

        });

      } else {
          //------------------if phone number is same  --------------------------------
          Driver.findOne({
          where: {
            phone_number: req.body.phone_number
          }
        }).then(driver => {
          if (driver) {
            return res.status(200).send({
              status: 400,
              message: "Failed! Phone Number is already in use!",
              successData: {
              }

            });
          } else {
            console.log("no matched")
            next();
          }
        }).catch(err => {
          return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {}
          });
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
  checkDuplicateEmailOrPhone_number: checkDuplicate,
  checkDuplicateLatitudeOrLongitude: checkDuplicateLatitudeOrLongitude,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
