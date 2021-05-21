//---------Admin Panel Import------------
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const messages = require("./messages");
const validater = require("./validater");
const session = require("./session");

//-------- Vendor Imports ----------
const vendorAuthJwt = require("./vendor/authJwt");
const vendorVerifySignUp = require("./vendor/verifySignUp");


//-------- Customer Imports ----------
const customerAuthJwt = require("./customer/authJwt");
const customerVerifySignUp = require("./customer/verifySignUp");

//-------- Driver Imports ----------
const driverAuthJwt = require("./driver/authJwt");
const driverVerifySignUp = require("./driver/verifySignUp");
const driverVerifyNumberPlate = require("./driver/driverVerifyNumberPlate");

module.exports = {
  authJwt,
  verifySignUp,
  messages,
  session,
  vendorAuthJwt,
  vendorVerifySignUp,
  driverAuthJwt,
  driverVerifySignUp,
  driverVerifyNumberPlate,
  customerAuthJwt,
  customerVerifySignUp

};
