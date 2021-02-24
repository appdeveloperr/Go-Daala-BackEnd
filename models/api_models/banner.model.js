module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banners", {
        banner_type: {
            type: Sequelize.STRING
        },
        image_path: {
            type: Sequelize.STRING
        }
    });

    return Banner;
};
