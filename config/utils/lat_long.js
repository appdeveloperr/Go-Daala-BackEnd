const moment = require('moment');




function formatLatLong(room, driver_id, lat, long) {
  return {
    room,
    driver_id,
    lat,
    long
  };
}

module.exports = 
  formatLatLong
;
