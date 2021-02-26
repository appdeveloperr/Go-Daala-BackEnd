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

db.user = require("../api_models/user.model.js")(sequelize, Sequelize);
db.role = require("../api_models/role.model")(sequelize, Sequelize);
db.banner = require("../api_models/banner.model")(sequelize, Sequelize);
db.promo = require("../api_models/promo.model")(sequelize, Sequelize);
db.vendor = require("../api_models/vendor.model")(sequelize, Sequelize);



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

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
