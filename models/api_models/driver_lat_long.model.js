module.exports = (sequelize, Sequelize) => {
    const Dirver_lat_long = sequelize.define("driver_lat_long", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        latitude: {
            type: Sequelize.STRING
        },
        longitude: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        }


    });

    return Dirver_lat_long;

}