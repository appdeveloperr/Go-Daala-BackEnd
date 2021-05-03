var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var contectus_controller = require('../../controllers/admin_controllers/contectus');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  

//-----------------admin get all contect us or messages----------------
app.get('/admin/get_content_us',isAdmin,contectus_controller.get_contect_us);

//-----------------outsider create contect us or message----------------
app.post('/admin/contect_us',contectus_controller.create)



app.get('/payment_get_way',contectus_controller.payment_method)
}