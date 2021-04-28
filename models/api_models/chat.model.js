module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define("chat", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        mobile_no: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        },
        time: {
            type: Sequelize.STRING
        }
    });

    return Chat;
};