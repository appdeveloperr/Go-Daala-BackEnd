module.exports = (sequelize, Sequelize) => {
    const Driver = sequelize.define("drivers", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profile: {
        type: Sequelize.STRING
      },
      cnic: {
        type: Sequelize.STRING
      },
      driving_license: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      account_info: {
        type: Sequelize.STRING
      },
      fcm_token: {
        type: Sequelize.STRING
      },
      total_rating: {
        type: Sequelize.STRING
      },
      total_review: {
        type: Sequelize.STRING
      }
    });
  
    return Driver;
  };
  