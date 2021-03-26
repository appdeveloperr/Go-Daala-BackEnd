
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var driver_controller = require('../../controllers/admin_controllers/driver');


module.exports = function (app) {
  



//-----------------get all driver admin side----------------
app.get('/admin/all_driver/index',driver_controller.index);

//-----------------get register drivers admin side----------------
app.get('/admin/register/drivers',driver_controller.register_drivers);

//-----------------get unregister driver admin side----------------
app.get('/admin/unregister/drivers',driver_controller.unregister_drivers);

//-----------------get active driver admin side----------------
app.get('/admin/active/drivers',driver_controller.active_drivers)


//-----------------get driver unblock admin side----------------
app.get('/admin/driver/unblock/:id',driver_controller.unblock);

//-----------------get driver block admin side----------------
app.get('/admin/driver/block/:id',driver_controller.block);

//-----------------get  driver delete admin side----------------
app.get('/admin/driver/delete/:id',driver_controller.delete);



//-----------------get  driver and his vehicle information admin side----------------
app.get('/driver/vehicles/:id',driver_controller.information);


//-----------------get  vehicle active  admin side----------------
app.get('/admin/driver/vehicle/active/:id',driver_controller.active);


//-----------------get  vehicle unactive  admin side----------------
app.get('/admin/driver/vehicle/unactive/:id',driver_controller.unactive);


//-----------------get  driver all trips  admin side----------------
app.get('/driver/all_trips/:id',driver_controller.recent_trip);


}