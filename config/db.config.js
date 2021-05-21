module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "0322321us",
  DB: "go_daala_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

//------ AWS DB Credentials -------
   
// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "db@godaala",
//   DB: "go_daala_db",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };