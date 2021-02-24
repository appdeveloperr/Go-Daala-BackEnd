const { authJwt } = require("../../middleware");
const { validater } = require("../../middleware");
const controller = require("../../controllers/api_controllers/user.controller");
const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const User = db.user;
const Banner = db.banner;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var LocalStrategy = require('passport-local').Strategy;
var auth = require('../../controllers/admin_controllers/auth');
var banner = require('../../controllers/admin_controllers/banner');
var isAdmin = auth.isAdmin;
var create_banner = banner.create;
var edit_banner = banner.edit;
var index = banner.index
const multer = require('multer');
var path = require('path');
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


  app.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'you are logged out!');
    res.redirect('/');
  });

  app.get('/admin/dashboard', isAdmin, function (req, res) {
    
    res.render('admin/index', {
      userdata: req.user
    });
  });

  app.get('/admin/banner/index', isAdmin, index);




  app.get('/admin/banner/create', isAdmin, function (req, res) {
  
    res.render('admin/banner/create', {
      userdata: req.user
    });
  });



  // SET STORAGE
  const storage = multer.diskStorage({
    destination: function(req,file,cb){
     cb(null,'./public/files/uploadsFiles/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'|| file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

  const uploads = multer({ storage: storage,fileFilter: fileFilter });



  app.post("/admin/banner/upload",isAdmin,uploads.single('myFile'),create_banner);

  app.get("/admin/banner/edit/:id",isAdmin,edit_banner);
  





};
