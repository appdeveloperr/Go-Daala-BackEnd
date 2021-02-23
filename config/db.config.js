module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "jojo786786",
  DB: "go_daala_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};