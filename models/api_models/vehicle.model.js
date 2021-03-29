module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define("vehicles", {
        vehicle_type: {
            type: Sequelize.STRING
        },
        service: {
            type: Sequelize.STRING
        },
        distance: {
            type: Sequelize.STRING
        },
        time: {
            type: Sequelize.STRING
        },
        image_path: {
            type: Sequelize.STRING
        }
    });

    return Vehicle;
};


