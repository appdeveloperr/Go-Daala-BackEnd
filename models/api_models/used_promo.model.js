module.exports = (sequelize, Sequelize) => {
    const Used_promo = sequelize.define("used_promos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        }
    });

    return Used_promo;
};
