var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var vendor_controller = require('../../controllers/admin_controllers/vendor');

module.exports = function (app) {
  
  //-----------------get all Vendors admin side----------------
app.get('/admin/vendor/index',isAdmin,vendor_controller.index);

//-----------------get information Vendors admin side----------------
app.get('/vendor/information/:id',isAdmin,vendor_controller.info);

//-----------------get vendor unblock admin side----------------
app.get('/admin/vendor/unblock/:id',isAdmin,vendor_controller.unblock);

//-----------------get vendor block admin side----------------
app.get('/admin/vendor/block/:id',isAdmin,vendor_controller.block);

//-----------------get  vendor delete admin side----------------
app.get('/admin/vendor/delete/:id',isAdmin,vendor_controller.delete);

}