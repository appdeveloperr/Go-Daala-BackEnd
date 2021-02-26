module.exports = (sequelize, Sequelize) => {
    const Promo = sequelize.define("promos", {
      code: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.INTEGER
      },
      publish: {
        type: Sequelize.STRING
      }
    });
  
    return Promo;
  };
  