//---------Admin Panel Import------------
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const messages = require("./messages");
const validater = require("./validater");
const session = require("./session");

//-------- Vendor Imports ----------
const vendorAuthJwt = require("./vendor/authJwt");
const vendorVerifySignUp = require("./vendor/verifySignUp");

//-------- Vendor Imports ----------
const driverAuthJwt = require("./driver/authJwt");
const driverVerifySignUp = require("./driver/verifySignUp");
const driverVerifyNumberPlate = require("./driver/driverVerifyNumberPlate");

module.exports = {
  authJwt,
  verifySignUp,
  messages,
  validater,
  session,
  vendorAuthJwt,
  vendorVerifySignUp,
  driverAuthJwt,
  driverVerifySignUp,
  driverVerifyNumberPlate
};
