const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
var Reviews = db.review;
const Driver = db.driver;
var Vendor = db.vendor;
var Trip = db.trip;

//-------------------vendor create review for trip--------------------------------
exports.create_review = (req, res) => {
    req.checkBody('rating', 'Rating must have Number needed!').notEmpty();
    req.checkBody('discription', 'Discription must have needed!').notEmpty();
    req.checkBody('trip_id', 'Trip_id must have id required!').notEmpty();
    req.checkBody('driver_id', 'Driver_id must have id required!').notEmpty();
    req.checkBody('vendor_id', 'Driver_id must have id required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in driver Create review",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
   
        // Save trips to Database
        Reviews.create({
            rating: req.body.rating,
            discription: req.body.discription,
            trip_id: req.body.trip_id,
            driver_id: req.body.driver_id,
            vendor_id: null
        }).then(reviews => {
            Vendor.findOne({
                where: {
                    id: req.body.vendor_id
                }
            }).then(vendor_rating => {

                var total_ratings = parseFloat(vendor_rating.total_rating);
                var total_reviews = parseFloat(vendor_rating.total_review);
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
                        message: "Create driver reviews   is successful",
                        successData: {
                            review: {
                                id: reviews.id,
                                rating: reviews.rating,
                                discription: reviews.discription,
                                trip_id: reviews.trip_id,
                                driver_id: reviews.driver_id,
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


//--------------------driver get vendor review from trip------------------------------
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
                    if (item.dataValues.vendor_id != null) {//------------if vendor is gave reviews to driver ------//////

                        Vendor.findOne({
                            where: {
                                id: item.dataValues.vendor_id
                            }
                        }).then(vendor => {
                            if (vendor != null || vendor != '') {

                                delete vendor.dataValues.password;
                                delete vendor.dataValues.id;
                                delete vendor.dataValues.account_info;
                                delete vendor.dataValues.fcm_token;
                                delete vendor.dataValues.createdAt;
                                delete vendor.dataValues.updatedAt;
                                // delete vendor.dataValues.phone_number;

                                Trip.findOne({
                                    where: {
                                        id: req.body.trip_id
                                    }
                                }).then(trip => {
                                    if (trip != null || trip != '') {
                                        return res.status(200).send({
                                            status: 200,
                                            message: "get driver reviews   is successful",
                                            successData: {
                                                reviews_list: {
                                                    review: reviews
                                                },
                                                vendor: vendor.dataValues
                                                ,
                                                trip: trip.dataValues

                                            }
                                        });
                                    } else {
                                        return res.status(200).send({
                                            status: 200,
                                            message: "get driver reviews   is successful",
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
                                return res.status(200).send({
                                    status: 200,
                                    message: "get driver reviews   is successful",
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

                });


                Trip.findOne({
                    where: {
                        id: req.body.trip_id
                    }
                }).then(trip => {
                    if (trip != null || trip != '') {
                        Vendor.findOne({
                            where: {
                                id: trip.dataValues.vendor_id
                            }
                        }).then(vendor => {
                            delete vendor.dataValues.password;
                            delete vendor.dataValues.id;
                            delete vendor.dataValues.account_info;
                            delete vendor.dataValues.fcm_token;
                            delete vendor.dataValues.createdAt;
                            delete vendor.dataValues.updatedAt;
                            
                            return res.status(200).send({
                                status: 200,
                                message: "get driver reviews   is successful",
                                successData: {
                                    reviews_list: {
                                        review: reviews
                                    },
                                    vendor: vendor.dataValues
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
                            message: "get driver reviews   is successful",
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

                });

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
