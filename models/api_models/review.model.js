module.exports = (sequelize, Sequelize) => {
    const Reviews = sequelize.define("reviews", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,

        },
        rating: {
            type: Sequelize.STRING
        },
        discription: {
            type: Sequelize.STRING
        }
    });

    return Reviews;
};
