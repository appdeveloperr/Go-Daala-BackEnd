const db = require("../../models/api_models");
const ROLES = db.ROLES;
const Vendor = db.vendor;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  Vendor.findOne({
    where: {
      username: req.body.username
    }
  }).then(vendor => {
    if (vendor) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    Vendor.findOne({
      where: {
        email: req.body.email
      }
    }).then(vendor => {
      if (vendor) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
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
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
