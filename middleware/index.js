//---------Admin Panel Import------------
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const messages = require("./messages");
const validater = require("./validater");
const session = require("./session");



//-------- Vendor Imports ----------
const adminAuthJwt = require("./admin/authJwt");
const adminVerifySignUp = require("./admin/verifySignUp");

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
  adminAuthJwt,
  adminVerifySignUp,
  driverAuthJwt,
  driverVerifySignUp,
  driverVerifyNumberPlate,
  customerAuthJwt,
  customerVerifySignUp

};
