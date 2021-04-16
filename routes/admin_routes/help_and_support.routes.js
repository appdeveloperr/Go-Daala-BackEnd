
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var help_support = require('../../controllers/admin_controllers/help_support');


module.exports = function (app) {
  
//-----------------Admin get all Help and support index file ----------------
app.get('/admin/help_support/index',isAdmin,help_support.index);

//-----------------Admin reply  of message open page ----------------
app.get('/contect_us/reply/:id',isAdmin,help_support.reply);


//-----------------admin reply upload ----------------
app.post('/admin/help_support/reply',isAdmin,help_support.upload_reply);
}