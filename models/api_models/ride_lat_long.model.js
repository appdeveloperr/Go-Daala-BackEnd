module.exports = (sequelize, Sequelize) => {
    const Ride_lat_long = sequelize.define("ride_lat_long", {
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
        }


    });

    return Ride_lat_long;

}