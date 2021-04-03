
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var notification = require('../../controllers/admin_controllers/notification.controller');


module.exports = function (app) {
  
//-----------------admin get notification ----------------
app.get('/admin/notification/index',isAdmin,notification.notification_index);


//-----------------admin get notification ----------------
app.get('/admin/notification/create',isAdmin,notification.create);

//-----------------admin get notification ----------------
app.post('/admin/notification/send-to-all',notification.sendtoAll);
}