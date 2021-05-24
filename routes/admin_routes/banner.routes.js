
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var banner_controller = require('../../controllers/admin_controllers/banner');




module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
  //---------------------bannar index-----------------------
  app.get('/admin/banner/index', isAdmin, banner_controller.index);



  //---------------------get bannar  create-----------------------
  app.get('/admin/banner/create', isAdmin, function (req, res) {

    res.render('admin/banner/create', {
      userdata: req.user
    });
  });












  app.post("/admin/banner/upload", 
  // isAdmin, 
   banner_controller.create
   );



//------------------post banner create-----------------------------------------
  // app.post("/admin/banner/upload", isAdmin, uploads.single('myFile'), banner_controller.create);

//------------------get banner edit  && redirect to get banner edit  To next route -----------------------------------------
  app.get("/admin/banner/Edit/:id", isAdmin, function (req, res) {
    var id = req.params.id;
    res.redirect('/admin/Edit_bannar/' + id);

  });

  
  app.get('/admin/Edit_bannar/:id',isAdmin, banner_controller.edit);

  //------------------post banner update---------------------------------
  app.post("/admin/banner/update", isAdmin,banner_controller.update);
    

  //-----------------get banner delete ---------------------
  app.get('/admin/banner/delete/:id',isAdmin,banner_controller.delete); 
//----------------------------banner  side end -------------




}
