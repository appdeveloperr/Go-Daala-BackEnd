
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var faq_controller = require('../../controllers/admin_controllers/faq');


module.exports = function (app) {
  

//-----------------get all FAQ'S list ----------------
app.get('/admin/faqs/index',isAdmin,faq_controller.faqs_index)

//----------------- get admin create FAQ's----------------
app.get('/admin/faqs/create',isAdmin,faq_controller.faqs_create)

//-----------------admin upload create FAqs list----------------
app.post('/admin/faqs/upload',isAdmin,faq_controller.faqs_upload);

//-----------------admin edit FAQ'S ----------------
app.get('/faqs/Edit/:id',isAdmin,faq_controller.faqs_edit);

//-----------------ADMIN  delete FAQ's ----------------
app.get('/admin/faqs/delete/:id',isAdmin,faq_controller.faqs_delete);
//-----------------admin update Faqs list----------------
app.post('/admin/faqs/update',isAdmin,faq_controller.faqs_update);






}