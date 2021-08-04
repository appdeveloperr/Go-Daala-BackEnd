module.exports = (sequelize, Sequelize) => {
    const Business_categories = sequelize.define("Business_categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING
        }
    });

    return Business_categories;
};