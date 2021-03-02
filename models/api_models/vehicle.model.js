module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define("vehicles", {
        vehicle_type: {
            type: Sequelize.STRING
        },
        image_path: {
            type: Sequelize.STRING
        }
    });

    return Vehicle;
};


