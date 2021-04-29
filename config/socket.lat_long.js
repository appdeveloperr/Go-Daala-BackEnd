const db = require("../models/api_models");
const Dirver_lat_long = db.driver_lat_long;
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  get_lat_long
} = require('./utils/users');


exports.socket_lat_long = function (io) {
  console.log("lat long io");

  const AppName = 'Go Daala App';

  // Run when client connects
  io.on('connection', socket => {
    socket.on('driver_lat_long', ({ driver_id, lat, long }) => {
      const driver = get_lat_long(socket.id, driver_id, lat, long);

      socket.join(driver.driver_id);
    

      // Welcome current user
      socket.emit('driver_lat_long', driver);

      // Broadcast when a user connects
      socket.broadcast
        .to(driver.driver_id)
        .emit(
          'driver_lat_long',
          driver
        );
console.log("this is driver data: "+driver);
      Dirver_lat_long.findOne({
        where: {
          driver_id: driver[0].driver_id
        }
      }).then(dri => {
        console.log("after finding the driver Data: "+dri);
        if (dri == null || dri == '') {
          Dirver_lat_long.create({
            latitude: driver[0].lat,
            longitude: driver[0].long,
            driver_id: driver[0].driver_id,
            status: 'available'
          }).then(driver_lat => {
            if (driver_lat) {
              console.log('Driver current location is created successfuly');
            }
          }).catch(err => {
            console.log('Driver current location is not created ',err);
          

          });
        } else {

          Dirver_lat_long.update({
            latitude: driver[0].lat,
            longitude: driver[0].long,
            status: 'available'

          },
            {
              where: { driver_id: driver[0].driver_id },
              returning: true,
              plain: true
            }).then(update_lat_long => {


              console.log('Driver current location is updated successfuly')

            }).catch(err => {

              console.log('Driver current location is not updated! ',err)

            });
        }
      }).catch(err => {

        console.log('Driver lat lon table is not exist in db! ',err)

      });
    });


  });
}