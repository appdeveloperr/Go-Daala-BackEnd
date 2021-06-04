module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
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
    city: {
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
    },
    invite_code: {
      type: Sequelize.STRING
    }
  });

  return Customer;
};


