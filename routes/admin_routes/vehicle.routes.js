
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var vehicle_controller = require('../../controllers/admin_controllers/vehicle');

const multer = require('multer');
var path = require('path');



const fs = require('fs');
module.exports = function (app) {
  
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



}