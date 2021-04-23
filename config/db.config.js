module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "db@godaala",
  DB: "go_daala_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
