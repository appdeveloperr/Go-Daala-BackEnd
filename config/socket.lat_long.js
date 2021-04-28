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
      console.log(driver);

      // Welcome current user
      socket.emit('driver_lat_long', driver);

      // Broadcast when a user connects
      socket.broadcast
        .to(driver.driver_id)
        .emit(
          'driver_lat_long',
          driver
        );

      Dirver_lat_long.findOne({
        where: {
          driver_id: req.body.driver_id
        }
      }).then(dri => {
        if (dri == null || dri == '') {
          Dirver_lat_long.create({
            latitude: driver.lat,
            longitude: driver.long,
            driver_id: driver.driver_id,
            status: 'available'
          }).then(driver_lat => {
            if (driver_lat) {
              console.log('Driver current location is created successfuly');
            }
          }).catch(err => {

            return res.status(200).send({
              status: 400,
              message: err.message,
              successData: {}
            });

          });
        } else {

          Dirver_lat_long.update({
            latitude: driver.lat,
            longitude: driver.long,
            status: 'available'

          },
            {
              where: { driver_id: driver.driver_id },
              returning: true,
              plain: true
            }).then(update_lat_long => {


              console.log('Driver current location is updated successfuly')

            }).catch(err => {

              return res.status(200).send({
                status: 400,
                message: err.message,
                successData: {}
              });

            });
        }
      }).catch(err => {

        return res.status(200).send({
          status: 400,
          message: err.message,
          successData: {}
        });

      });
    });


  });
}