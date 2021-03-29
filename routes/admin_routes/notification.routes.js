
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var notification = require('../../controllers/admin_controllers/notification');


module.exports = function (app) {
  


//-----------------admin get notification ----------------
app.get('/admin/notification/index',isAdmin,notification.create);



}