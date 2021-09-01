module.exports = (sequelize, Sequelize) => {
    const Driver = sequelize.define("drivers", {
      id:{
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true

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
      cnic_text: {
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
      },
      paid_company_commission:{
        type: Sequelize.STRING
      },
      invite_code:{
        type: Sequelize.STRING
     },
      referal_code:{
        type: Sequelize.STRING
      },
      bonus_amount:{
        type: Sequelize.STRING
      },
      is_referal_bonus_given:{
        type: Sequelize.STRING
      },
      is_myfirst_ride_bonus_given:{
        type: Sequelize.STRING
      }
    });
  
    return Driver;
  };
  