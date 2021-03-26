const { verifySignUp } = require("../../middleware");
const controller = require("../../controllers/admin_controllers/auth.controller");
var LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/admin/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,

    ],
    controller.signup
  );

  app.get("/", function (req, res) {

    if (res.locals.user) res.redirect('/admin/dashboard');
    res.render('admin/login', {
      email: '',
      password: ''
    });
  });


  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/', failureFlash: true, }),
    function (req, res) {
      res.redirect('/admin/dashboard');
    });





};
