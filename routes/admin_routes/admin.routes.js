
// const { authJwt } = require("../../middleware");
// const { validater } = require("../../middleware");
// const controller = require("../../controllers/api_controllers/user.controller");
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
var controller = require('../../controllers/admin_controllers/banner');
var isAdmin = auth.isAdmin;
const multer = require('multer');
var path = require('path');
const passport = require('passport');
const fs = require('fs');




module.exports = function (app) {



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

  app.get('/admin/banner/index', isAdmin, controller.index);




  app.get('/admin/banner/create', isAdmin, function (req, res) {

    res.render('admin/banner/create', {
      userdata: req.user
    });
  });



  // SET STORAGE
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/files/uploadsFiles/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const uploads = multer({ storage: storage, fileFilter: fileFilter });


  app.post("/admin/banner/upload", isAdmin, uploads.single('myFile'), controller.create);


  app.get("/admin/banner/Edit/:id", isAdmin, function (req, res) {
    var id = req.params.id;
    res.redirect('/admin/Edit_bannar/' + id);

  });

  app.get('/admin/Edit_bannar/:id', controller.edit)
  app.post("/admin/banner/update", isAdmin,uploads.single('myFile'),controller.update);
    
  app.get('/admin/banner/delete/:id',controller.delete);
  



};
