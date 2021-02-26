module.exports = (sequelize, Sequelize) => {
    const Vendor = sequelize.define("vendors", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return Vendor;
  };
  