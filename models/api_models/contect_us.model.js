module.exports = (sequelize, Sequelize) => {
    const Contect_us = sequelize.define("contect_us", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        }


    });

    return Contect_us;
};