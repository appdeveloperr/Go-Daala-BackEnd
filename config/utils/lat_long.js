const moment = require('moment');




function formatLatLong(room, driver_id, lat, long,rotation) {
  return {
    room,
    driver_id,
    lat,
    long,
    rotation
  };
}

module.exports = 
  formatLatLong
;
