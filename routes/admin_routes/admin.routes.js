const { authJwt } = require("../../middleware");
const { validater } = require("../../middleware");
const controller = require("../../controllers/api_controllers/user.controller");
const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var LocalStrategy = require('passport-local').Strategy;
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
// var isEditor = auth.isEditor;
const passport = require('passport');
// const { where } = require("sequelizers/types");




module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/", function (req, res) {
     if (res.locals.user) res.redirect('/dashboard');
    res.render('admin/login', {
      email: '',
      password: ''
    });
  });


  app.post('/login', 
  passport.authenticate('local',{ failureRedirect: '/' ,failureFlash : true,}),
  function(req, res) {
    res.redirect('/dashboard');
  });


  app.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'you are logged out!');
    res.redirect('/');
  });

  app.get('/dashboard',isAdmin,function(req,res){
    // console.log(req.user);
  res.render('admin/index',{
    userdata:req.user
  });
  });


  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
