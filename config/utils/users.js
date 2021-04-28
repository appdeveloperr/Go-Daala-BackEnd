const users = [];
const drivers= [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function get_lat_long(id, driver_id, lat , long) {
  const driver = { id, driver_id, lat , long };

  drivers.push(driver);

  return drivers;
}


function get_lat_long_room(id, room , driver_id, lat , long) {
  const driver = { id, room , driver_id, lat , long };

  drivers.push(driver);

  return driver;
}



module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  get_lat_long,
  get_lat_long_room
};
