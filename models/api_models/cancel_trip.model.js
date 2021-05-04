module.exports = (sequelize, Sequelize) => {
    const Cancel_trip = sequelize.define("cancel_trip", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        }
    });

    return Cancel_trip;
};


