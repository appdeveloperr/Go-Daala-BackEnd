module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "jojo786786",
  DB: "delivery_takers_db",
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
//  HOST: "ec2-54-157-100-65.compute-1.amazonaws.com",
//  USER: "vrxoedmoehxohl",
//  PASSWORD: "935c134aac3e838c52275c9e3ea88594ea367e2de13a2dada249e04ae4d4e466",
//  DB: "d2hovpf6s94qo4",
//  dialect: "postgres://vrxoedmoehxohl:935c134aac3e838c52275c9e3ea88594ea367e2de13a2dada249e04ae4d4e466@ec2-54-157-100-65.compute-1.amazonaws.com:5432/d2hovpf6s94qo4",
//  pool: {
//    max: 5,
//    min: 0,
//    acquire: 30000,
//    idle: 10000
//  }
// };