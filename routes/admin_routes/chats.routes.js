

var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var driver_controller = require('../../controllers/admin_controllers/driver');


module.exports = function (app) {


//-----------------chat system----------------
app.get('/chat/index',driver_controller.chat);





}

