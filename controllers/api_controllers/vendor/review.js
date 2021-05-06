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
        var total_ratings = null;
        var total_reviews = null;
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
                total_ratings = parseFloat(driver_rating.total_rating);
                total_reviews = parseFloat(driver_rating.total_review);
                total_ratings = total_ratings + parseFloat(req.body.rating);
                total_reviews = total_reviews + 1;
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
                trip_id: req.body.trip_id
            }
        }).then(reviews => {
            if (reviews == null || reviews == '') {

                Trip.findOne({
                    where: {
                        id: req.body.trip_id

                    },
                    include: [
                        {
                            model: db.driver
                        }
                    ]

                }).then(trip => {

                    delete trip.driver.dataValues.password;
                    if (trip != null || trip != '' ) {


                        return res.status(200).send({
                            status: 200,
                            message: "get Vendor reviews   is successful",
                            successData: {
                                reviews_list: {
                                    review: reviews
                                },

                                trip: trip.dataValues

                            }
                        });


                    } else {
                        return res.status(200).send({
                            status: 400,
                            message: "get Vendor reviews  from trip and trip was not found in DB",
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
                                                trip: trip.dataValues

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
                    },
                    include:[
                        {
                            model: db.driver
                        }
                    ]
                }).then(trip => {
                    if (trip != null || trip != '') {
   
                            delete trip.driver.dataValues.password;
                           

                            return res.status(200).send({
                                status: 200,
                                message: "get Vendor reviews   is successful",
                                successData: {
                                    reviews_list: {
                                        review: reviews
                                    },
                                    trip: trip.dataValues

                                }
                            });
                   

                    } else {
                        return res.status(200).send({
                            status: 400,
                            message: "get Vendor reviews  from trip and trip was not found in DB",
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