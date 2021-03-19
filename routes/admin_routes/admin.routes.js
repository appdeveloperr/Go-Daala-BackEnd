
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
var vehicle_controller = require('../../controllers/admin_controllers/vehicle');
var promo_controller = require('../../controllers/admin_controllers/promo');
var all_vendor_controller = require('../../controllers/admin_controllers/all_vendor');
var all_driver_controller = require('../../controllers/admin_controllers/all_driver');
var help_support = require('../../controllers/admin_controllers/help_support')
var isAdmin = auth.isAdmin;
const multer = require('multer');
var path = require('path');
const passport = require('passport');
const fs = require('fs');
const stripe = require('stripe');



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
app.post("/admin/promo/upload_promo",isAdmin,promo_controller.create);

//------------------get banner edit  && redirect to get banner edit  To next route -----------------------------------------
app.get("/admin/promo/Edit/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  res.redirect('/admin/Edit_promo/' + id);

});


app.get('/admin/Edit_promo/:id', promo_controller.edit);


  //------------------post promo update---------------------------------
  app.post("/admin/promo/update",promo_controller.update);
    

  //-----------------get promo delete ---------------------
  app.get('/admin/promo/delete/:id',promo_controller.delete); 
//----------------------------banner  side end -------------





  //--------------------vehicles side is start -------------------------

  //---------------------vehicle index-----------------------
  app.get('/admin/vehicle/index', isAdmin, vehicle_controller.index);



  //---------------------get vehicle  create-----------------------
  app.get('/admin/vehicle/create', isAdmin, function (req, res) {

    res.render('admin/vehicle/create', {
      userdata: req.user
    });
  });




//------------------post vehicle create-----------------------------------------
  app.post("/admin/vehicle/upload", isAdmin, uploads.single('myFile'), vehicle_controller.create);

//------------------get vehicle edit  && redirect to get vehicle edit  To next route -----------------------------------------
  app.get("/admin/vehicle/Edit/:id", isAdmin, function (req, res) {
    var id = req.params.id;
    res.redirect('/admin/Edit_vehicle/' + id);

  });

  
  app.get('/admin/Edit_vehicle/:id', vehicle_controller.edit);

  //------------------post vehicle update---------------------------------
  app.post("/admin/vehicle/update", isAdmin,uploads.single('myFile'),vehicle_controller.update);
    

  //-----------------get vehicle delete ---------------------
  app.get('/admin/vehicle/delete/:id',vehicle_controller.delete); 



//----------------------------Vehicles  side end -------------
//--------------------------------------------------------------//


//-----------------get all Vendors admin side----------------
app.get('/admin/all_vendor/index',all_vendor_controller.index);

//-----------------get information Vendors admin side----------------
app.get('/vendor/information/:id',all_vendor_controller.info);

//-----------------get vendor unblock admin side----------------
app.get('/admin/vendor/unblock/:id',all_vendor_controller.unblock);

//-----------------get vendor block admin side----------------
app.get('/admin/vendor/block/:id',all_vendor_controller.block);

//-----------------get  vendor delete admin side----------------
app.get('/admin/vendor/delete/:id',all_vendor_controller.delete);






//-----------------get all driver admin side----------------
app.get('/admin/all_driver/index',all_driver_controller.index);

//-----------------get driver unblock admin side----------------
app.get('/admin/driver/unblock/:id',all_driver_controller.unblock);

//-----------------get driver block admin side----------------
app.get('/admin/driver/block/:id',all_driver_controller.block);

//-----------------get  driver delete admin side----------------
app.get('/admin/driver/delete/:id',all_driver_controller.delete);



//-----------------get  driver and his vehicle information admin side----------------
app.get('/driver/vehicles/:id',all_driver_controller.information);


//-----------------get  vehicle active  admin side----------------
app.get('/admin/driver/vehicle/active/:id',all_driver_controller.active);


//-----------------get  vehicle unactive  admin side----------------
app.get('/admin/driver/vehicle/unactive/:id',all_driver_controller.unactive);


//-----------------get  driver all trips  admin side----------------
app.get('/driver/all_trips/:id',all_driver_controller.recent_trip);


//-----------------chat system----------------
app.get('/chat/index',all_driver_controller.chat);

app.get('/admin/get_content_us',all_driver_controller.get_contect_us);

app.post('/admin/contect_us',all_driver_controller.create)


app.get('/admin/faqs/index',all_driver_controller.faqs_index)

app.get('/admin/faqs/create',all_driver_controller.faqs_create)

app.post('/admin/faqs/upload',all_driver_controller.faqs_upload);


app.get('/faqs/Edit/:id',all_driver_controller.faqs_edit);


app.get('/admin/faqs/delete/:id',all_driver_controller.faqs_delete);

app.post('/admin/faqs/update',all_driver_controller.faqs_update);


app.get('/admin/help_support/index',help_support.index);

app.get('/contect_us/reply/:id',help_support.reply);


app.post('/admin/help_support/reply',help_support.upload_reply);


}

