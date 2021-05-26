
var auth = require('../../controllers/admin_controllers/auth');
var isAdmin = auth.isAdmin;
var booking = require('../../controllers/admin_controllers/booking');


module.exports = function (app) {
  


//-----------------admin get Booking index ----------------
app.get('/admin/booking/index',isAdmin,booking.index);

app.get('/admin/booking/ongoing',booking.ongoing);


//-----------------admin get Complete booking ----------------
app.get('/booking/index/complete',booking.complete);

//-----------------admin get cancel booking----------------
app.get('/booking/index/cancel',booking.cancel);


//-----------------develpor side testing ----------------
app.get('/booking/index/test',isAdmin,booking.test);

}