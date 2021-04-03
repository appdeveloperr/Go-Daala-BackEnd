module.exports = (sequelize, Sequelize) => {
    const Transaction_reminders = sequelize.define("notifications", {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true
        },
        body: {
            type: Sequelize.STRING,
            allowNull: true
        },
        is_read: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

    });

    return Transaction_reminders;
};
