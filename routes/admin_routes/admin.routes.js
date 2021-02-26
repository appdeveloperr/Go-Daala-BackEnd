
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
var banner_controller = require('../../controllers/admin_controllers/banner');
var promo_controller = require('../../controllers/admin_controllers/promo');
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



  //--------------------bannar side is start -------------------------

  //---------------------bannar index-----------------------
  app.get('/admin/banner/index', isAdmin, banner_controller.index);



  //---------------------get bannar  create-----------------------
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

//------------------post banner create-----------------------------------------
  app.post("/admin/banner/upload", isAdmin, uploads.single('myFile'), banner_controller.create);

//------------------get banner edit  && redirect to get banner edit  To next route -----------------------------------------
  app.get("/admin/banner/Edit/:id", isAdmin, function (req, res) {
    var id = req.params.id;
    res.redirect('/admin/Edit_bannar/' + id);

  });

  
  app.get('/admin/Edit_bannar/:id', banner_controller.edit);

  //------------------post banner update---------------------------------
  app.post("/admin/banner/update", isAdmin,uploads.single('myFile'),banner_controller.update);
    

  //-----------------get banner delete ---------------------
  app.get('/admin/banner/delete/:id',banner_controller.delete); 
//----------------------------banner  side end -------------





//----------------------------promo side start ---------------

//----------------------------get promo  index ---------------
app.get('/admin/promo/index', isAdmin, promo_controller.index);



//----------------------------get promo  create ---------------
app.get('/admin/promo/create_promo',isAdmin, function (req, res) {

  res.render('admin/promo/create', {
    userdata: req.user,
    code:'',
    type:'',
    discount:''
  });
});


//------------------post promo create-----------------------------------------
app.post("/admin/promo/upload_promo",isAdmin,function(req,res){
  // req.checkBody('code', 'Code must have value!').notEmpty();
  // req.checkBody('type', 'type must have selected needed!').notEmpty();
  // req.checkBody('discount', 'Discount must have value!').notEmpty();

console.log(req.body);
  // var errors = req.validationErrors();
  // console.log(errors);
	// if (errors) {
	// 	res.render('./admin/promo/create', {
  //     errors: errors,
  //     userdata: req.user,
  //     code:req.body.code,
  //     type:req.body.type,
  //     discount:req.body.discount
	// 	});
	// } else {
  // console.log("no validation error");
  // }
});

}