var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var customer_controller = require('../../controllers/admin_controllers/customer');

module.exports = function (app) {
  
  //-----------------get all customers admin side----------------
app.get('/admin/customer/index',isAdmin,customer_controller.index);

//-----------------get information customers admin side----------------
app.get('/customer/information/:id',isAdmin,customer_controller.info);

//-----------------get customer unblock admin side----------------
app.get('/admin/customer/unblock/:id',isAdmin,customer_controller.unblock);

//-----------------get customer block admin side----------------
app.get('/admin/customer/block/:id',isAdmin,customer_controller.block);

//-----------------get  customer delete admin side----------------
app.get('/admin/customer/delete/:id',isAdmin,customer_controller.delete);

}