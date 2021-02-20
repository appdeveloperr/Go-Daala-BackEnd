module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "0322321us",
  DB: "testdb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};