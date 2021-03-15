module.exports = (sequelize, Sequelize) => {

    const Otp = sequelize.define("otps", {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,

        },
        otp: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull:false
        }
    });

    return Otp;
};