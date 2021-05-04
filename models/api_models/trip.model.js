module.exports = (sequelize, Sequelize) => {
    const Trips = sequelize.define("trips", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      pickup: {
        type: Sequelize.STRING
      },
      dropoff: {
        type: Sequelize.STRING
      },
      dropoff_lat: {
        type: Sequelize.STRING
      },
      dropoff_long: {
        type: Sequelize.STRING
      },
      pickup_lat: {
        type: Sequelize.STRING
      },
      pickup_long: {
        type: Sequelize.STRING
      },
      vehicle_name: {
        type: Sequelize.STRING
      },
      estimated_distance: {
        type: Sequelize.STRING
      },
      estimated_time: {
        type: Sequelize.STRING
      },
      total_cost: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }

    });
  
    return Trips;
  };