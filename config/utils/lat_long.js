const moment = require('moment');




function formatLatLong(room, driver_id, lat, long,rotaion) {
  return {
    room,
    driver_id,
    lat,
    long,
    rotaion
  };
}

module.exports = 
  formatLatLong
;
