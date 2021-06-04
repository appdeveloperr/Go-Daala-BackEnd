module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING
      },
      product_type: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.STRING
      },
     
      image: {
        type: Sequelize.STRING
      },
      total_rating: {
        type: Sequelize.STRING
      },
      total_review: {
        type: Sequelize.STRING
      }
     
    });
  
    return Product;
  };
  