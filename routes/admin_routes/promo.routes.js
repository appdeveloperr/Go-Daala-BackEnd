
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var promo_controller = require('../../controllers/admin_controllers/promo');



const fs = require('fs');
module.exports = function (app) {
  
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

  //----------------get list of used promo code with aghast of promo_id--------------//
  app.get('/vendor/used/promo/:id',
  function(req,res){
    var id = req.params.id;
     res.redirect('/used/promo/' + id);
  }
  ); 
   app.get('/used/promo/:id',promo_controller.used_promo_vendor) 






}