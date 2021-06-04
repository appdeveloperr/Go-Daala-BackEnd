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
db.notification = require("../api_models/notification.model")(sequelize, Sequelize);

//---------------------------api models-------------------------
db.chat = require("../api_models/chat.model")(sequelize, Sequelize);

//---------------------------customer models-------------------------
db.address = require("../api_models/address.model")(sequelize, Sequelize);
db.vehicle = require("../api_models/vehicle.model")(sequelize, Sequelize);
db.trip = require("../api_models/trip.model")(sequelize, Sequelize);
db.review = require("../api_models/review.model")(sequelize, Sequelize);

db.customer = require("../api_models/customer.model")(sequelize, Sequelize);


//---------------------------Admin app models-------------------------
db.admin = require("../api_models/admin.model")(sequelize, Sequelize);
db.product = require("../api_models/product.model")(sequelize, Sequelize);
// db.address = require("../api_models/address.model")(sequelize, Sequelize);
// db.vehicle = require("../api_models/vehicle.model")(sequelize, Sequelize);
// db.trip = require("../api_models/trip.model")(sequelize, Sequelize);
// db.review = require("../api_models/review.model")(sequelize, Sequelize);


//----------------------driver models-------------------------------
db.driver = require("../api_models/driver.model")(sequelize, Sequelize);
db.vehicle_reg = require("../api_models/vehicle_reg.model")(sequelize, Sequelize);
db.driver_lat_long = require("../api_models/driver_lat_long.model")(sequelize, Sequelize);
db.contect_us = require("../api_models/contect_us.model")(sequelize, Sequelize);
db.faqs = require("../api_models/faqs.model")(sequelize, Sequelize);
db.otp = require("../api_models/otp.model")(sequelize, Sequelize);
db.used_promos = require("../api_models/used_promo.model")(sequelize, Sequelize);
db.cancel_trip = require("../api_models/cancel_trip.model")(sequelize, Sequelize);
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




//---------customer save address with customer id--------//
db.address.belongsTo(db.customer, {
  foreignKey: "customer_id"
});

//---------vehicle register with driver id----------------------//
db.vehicle_reg.belongsTo(db.driver, {
  foreignKey: "driver_id"
});

//---------current location of driver lat long---------//
db.driver_lat_long.belongsTo(db.driver, {
  foreignKey: "driver_id"
});


//-----------trip--------------------//
db.trip.belongsTo(db.driver, {
  foreignKey: "driver_id"
});



db.trip.belongsTo(db.customer, {
  foreignKey: "customer_id"
});

//----------cancel trip relation--------------///
db.cancel_trip.belongsTo(db.driver, {
  foreignKey: "driver_id"
});





db.cancel_trip.belongsTo(db.customer, {
  foreignKey: "customer_id"
});

db.cancel_trip.belongsTo(db.trip, {
  foreignKey: "trip_id"
});


//--------------product review----------------//
db.review.belongsTo(db.product, {
  foreignKey: "product_id"
});

//--------------review--------------
db.review.belongsTo(db.driver, {
  foreignKey: "driver_id"
});




db.review.belongsTo(db.customer, {
  foreignKey: "customer_id"
});


db.review.belongsTo(db.trip, {
  foreignKey: "trip_id"
});




db.used_promos.belongsTo(db.customer, {
  foreignKey: "customer_id"
});
db.used_promos.belongsTo(db.promo, {
  foreignKey: "promo_id"
});
//--------------notification----------------//
db.notification.belongsTo(db.driver, {
  foreignKey: "driver_id"
});




db.notification.belongsTo(db.customer, {
  foreignKey: "customer_id"
});

//--------------chat with trip----------------//
db.chat.belongsTo(db.trip,{
  foreignKey: "trip_id"
});


//--------------Admin app can add product----------------//
db.product.belongsTo(db.admin, {
  foreignKey: "admin_id"
});

//--------------driver app can add product----------------//
db.product.belongsTo(db.driver, {
  foreignKey: "driver_id"
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
