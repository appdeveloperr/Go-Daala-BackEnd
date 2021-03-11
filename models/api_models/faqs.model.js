module.exports = (sequelize, Sequelize) => {
    const Faqs = sequelize.define("faqs", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING
      },
      disc: {
        type: Sequelize.STRING
      } 
    });
  
    return Faqs;
  };
  