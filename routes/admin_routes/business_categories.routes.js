const { vendorAuthJwt } = require("../../middleware");
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var business_categories_controller = require('../../controllers/admin_controllers/business_categories');




module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
  //---------------------business_categories index-----------------------
  app.get('/admin/business_categories/index', isAdmin, business_categories_controller.index);
app.post('/admin/business_categories/add', isAdmin, business_categories_controller.add);
app.post('/admin/business_categories/update', isAdmin, business_categories_controller.update);
app.get('/admin/business_categories/delete/:id', isAdmin, business_categories_controller.delete);

app.get('/admin/vendor/get_business_categories',vendorAuthJwt.verifyToken, business_categories_controller.api_get_business_categories);





}
