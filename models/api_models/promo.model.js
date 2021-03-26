module.exports = (sequelize, Sequelize) => {
  const Promo = sequelize.define("promos", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING
    },
    exp_date: {
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
