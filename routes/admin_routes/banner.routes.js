
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var banner_controller = require('../../controllers/admin_controllers/banner');

const multer = require('multer');
var path = require('path');

const fs = require('fs');
module.exports = function (app) {
  
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

  
  app.get('/admin/Edit_bannar/:id',isAdmin, banner_controller.edit);

  //------------------post banner update---------------------------------
  app.post("/admin/banner/update", isAdmin,uploads.single('myFile'),banner_controller.update);
    

  //-----------------get banner delete ---------------------
  app.get('/admin/banner/delete/:id',isAdmin,banner_controller.delete); 
//----------------------------banner  side end -------------




}