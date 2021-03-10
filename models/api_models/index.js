const config = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//-----------------------------admin models---------------------
db.user = require("../api_models/user.model.js")(sequelize, Sequelize);
db.role = require("../api_models/role.model")(sequelize, Sequelize);
db.banner = require("../api_models/banner.model")(sequelize, Sequelize);
db.promo = require("../api_models/promo.model")(sequelize, Sequelize);

//---------------------------vendor models-------------------------
db.vendor = require("../api_models/vendor.model")(sequelize, Sequelize);
db.address = require("../api_models/address.model")(sequelize, Sequelize);
db.vehicle = require("../api_models/vehicle.model")(sequelize, Sequelize);
db.trip = require("../api_models/trip.model")(sequelize, Sequelize);

//----------------------driver models-------------------------------
db.driver = require("../api_models/driver.model")(sequelize, Sequelize);
db.vehicle_reg = require("../api_models/vehicle_reg.model")(sequelize, Sequelize);

db.contect_us = require("../api_models/contect_us.model")(sequelize, Sequelize);

//Table Relationships
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.address.belongsTo(db.vendor, {
  foreignKey: "vendor_id"
});

db.vehicle_reg.belongsTo(db.driver, {
  foreignKey: "driver_id"
});

db.trip.belongsTo(db.driver, {
  foreignKey: "driver_id"
});

db.trip.belongsTo(db.vendor, {
  foreignKey: "vendor_id"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
