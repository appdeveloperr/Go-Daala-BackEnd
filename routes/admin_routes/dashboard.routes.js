
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var dashboard_controller = require('../../controllers/admin_controllers/dashboard');
module.exports = function (app) {
   app.get('/admin/dashboard', isAdmin,dashboard_controller.Dishboard);

}