// module.exports = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "jojo786786",
//   DB: "delivery_takers_db",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };

//------ AWS DB Credentials -------
   
module.exports = {
 HOST: "ec2-34-193-101-0.compute-1.amazonaws.com",
 USER: "usurpbvairqvxq",
 PASSWORD: "3ecdc8d04be333876260607abd3579d29b0aa1970b0c6b1693f4d9f2f7a9fcea",
 DB: "dc35b0q7tccej9",
 URL:"postgres://usurpbvairqvxq:3ecdc8d04be333876260607abd3579d29b0aa1970b0c6b1693f4d9f2f7a9fcea@ec2-34-193-101-0.compute-1.amazonaws.com:5432/dc35b0q7tccej9",
 dialect: "postgres",
 pool: {
   max: 5,
   min: 0,
   acquire: 30000,
   idle: 10000
 }
};