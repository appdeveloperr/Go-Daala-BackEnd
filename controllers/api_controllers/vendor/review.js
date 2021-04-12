const db = require("../../../models/api_models");
const Op = db.Sequelize.Op;
var Reviews = db.review;
var Driver = db.driver;
var Trip = db.trip;
var Vendor = db.vendor;
var Driver = db.driver;

//-------------------vendor create review for trip--------------------------------
exports.create_review = (req, res) => {
    req.checkBody('rating', 'Rating must have Number needed!').notEmpty();
    req.checkBody('discription', 'Discription must have needed!').notEmpty();
    req.checkBody('trip_id', 'Trip_id must have id required!').notEmpty();
    req.checkBody('vendor_id', 'Vendor_id must have id required!').notEmpty();
    req.checkBody('driver_id', 'Driver_id must have id required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in vendor Create review",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save Review to Database
        Reviews.create({
            rating: req.body.rating,
            discription: req.body.discription,
            trip_id: req.body.trip_id,
            vendor_id: req.body.vendor_id,
            driver_id: null
        }).then(reviews => {
            
            Driver.findOne({
                where: {
                    id: req.body.driver_id
                }
            }).then(driver_rating => {

                var total_ratings = driver_rating.dataValues.total_rating;
                var total_reviews = driver_rating.dataValues.total_review;
                total_rating = total_rating + req.body.rating;
                total_review = total_review + 1;
                Driver.update({
                    total_rating: total_ratings,
                    total_review: total_reviews
                }, {
                    where: { id: req.body.driver_id },
                    returning: true,
                    plain: true
                }).then(updated_reviews => {
                    return res.status(200).send({
                        status: 200,
                        message: "Create vendor reviews   is successful",
                        successData: {
                            review: {
                                id: reviews.id,
                                rating: reviews.rating,
                                discription: reviews.discription,
        
                                trip_id: reviews.trip_id,
                                vendor_id: reviews.vendor_id,
        
                            }
                        }
                    });
                }).catch(err => {

                    return res.status(200).send({
                        status: 400,
                        message: err.message,
                        successData: {}
                    });
        
                });
            }).catch(err => {

                return res.status(200).send({
                    status: 400,
                    message: err.message,
                    successData: {}
                });
    
            });

           


        }).catch(err => {

            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: {}
            });

        });

    }
}



var total_reviews = null;
var total_trip = null;
//--------------------vendor get driver review from trip------------------------------
exports.get_review = (req, res) => {
    req.checkBody('trip_id', 'Trip_id must have Id needed!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in vendor get review",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {

        Reviews.findAll({
            where: {
                trip_id: req.body.trip_id,
            }
        }).then(reviews => {

            if (reviews == null || reviews == '') {

                return res.status(200).send({
                    status: 200,
                    message: "get vendor reviews  is empty successful",
                    successData: {
                    }
                });
            } else {


                reviews.forEach(item => {
                    if (item.dataValues.driver_id != null) {




                        Driver.findOne({
                            where: {
                                id: item.dataValues.driver_id
                            }
                        }).then(drivers => {
                            if (drivers != null || drivers != '') {
                                delete drivers.dataValues.password;
                                delete drivers.dataValues.id;
                                delete drivers.dataValues.account_info;
                                delete drivers.dataValues.fcm_token;
                                delete drivers.dataValues.createdAt;
                                delete drivers.dataValues.updatedAt;
                                delete drivers.dataValues.phone_number;


                                Trip.findOne({
                                    where: {
                                        id: req.body.trip_id
                                    }
                                }).then(trip => {
                                    if (trip != null || trip != '') {
                                        return res.send({
                                            status: 200,
                                            message: "get  reviews   is successful",
                                            successData: {
                                                reviews_list: {
                                                    review: reviews
                                                },
                                                driver: drivers.dataValues,
                                                trip_data: trip.dataValues

                                            }
                                        });

                                    }
                                }).catch(err => {

                                    return res.status(200).send({
                                        status: 400,
                                        message: err.message,
                                        successData: {}
                                    });

                                })
                            }
                        }).catch(err => {

                            return res.status(200).send({
                                status: 400,
                                message: err.message,
                                successData: {}
                            });

                        })
                    }
                });


                Trip.findOne({
                    where: {
                        id: req.body.trip_id
                    }
                }).then(trip => {
                    if (trip != null || trip != '') {
                        Driver.findOne({
                            where: {
                                id: trip.dataValues.driver_id
                            }
                        }).then(driver => {
                            delete driver.dataValues.password;
                            delete driver.dataValues.id;
                            delete driver.dataValues.account_info;
                            delete driver.dataValues.fcm_token;
                            delete driver.dataValues.createdAt;
                            delete driver.dataValues.updatedAt;
                            delete driver.dataValues.phone_number;

                            return res.status(200).send({
                                status: 200,
                                message: "get Vendor reviews   is successful",
                                successData: {
                                    reviews_list: {
                                        review: reviews
                                    },
                                    driver: driver.dataValues
                                    ,
                                    trip: trip.dataValues

                                }
                            });
                        }).catch(err => {

                            return res.status(200).send({
                                status: 400,
                                message: err.message,
                                successData: {}
                            });

                        })

                    } else {
                        return res.status(200).send({
                            status: 200,
                            message: "get Vendor reviews   is successful",
                            successData: {
                            }
                        });
                    }
                }).catch(err => {

                    return res.status(200).send({
                        status: 400,
                        message: err.message,
                        successData: {}
                    });

                })
            }
        }).catch(err => {

            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: {}
            });

        });
    }
}