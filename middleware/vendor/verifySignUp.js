const db = require("../../models/api_models");
const ROLES = db.ROLES;
const Vendor = db.vendor;

checkDuplicateEmailOrPhone_number = (req, res, next) => {
  // Username
  console.log("email: ",req.body.email);
  Vendor.findOne({
    where: {
      email: req.body.email
    }
  }).then(vendor => {
    if (vendor) {
      return res.status(200).send({
        status: 400,
        message: "Failed! email is already in use!",
        successData: {
        }

      });

    }

    // Email
    Vendor.findOne({
      where: {
        phone_number: req.body.phone_number
      }
    }).then(vendor => {
      if (vendor) {


        return res.status(200).send({
          status: 400,
          message: "Failed! Phone Number is already in use!",
          successData: {
          }

        });


      }

      next();
    });
  });
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

const verifySignUp = {
  checkDuplicateEmailOrPhone_number: checkDuplicateEmailOrPhone_number,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
