module.exports = (sequelize, Sequelize) => {
    const Vehicle_register = sequelize.define("vehicles_register", {
        vehicle_type: {
            type: Sequelize.STRING
        },
        vehicle_document: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        number_plate: {
            type: Sequelize.STRING
        },
        color: {
            type: Sequelize.STRING
        },
        frint_image: {
            type: Sequelize.STRING
        },
        back_image: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        }

    });

    return Vehicle_register;
};