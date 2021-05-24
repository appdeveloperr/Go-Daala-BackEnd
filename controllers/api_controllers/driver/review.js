const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
var Reviews = db.review;
const Driver = db.driver;
var Vendor = db.vendor;
const Customer = db.customer;
var Trip = db.trip;

//-------------------vendor create review for trip--------------------------------
exports.create_review = (req, res) => {
    req.checkBody('rating', 'Rating must have Number needed!').notEmpty();
    req.checkBody('discription', 'Discription must have needed!').notEmpty();
    req.checkBody('trip_id', 'Trip_id must have id required!').notEmpty();
    req.checkBody('driver_id', 'Driver_id must have id required!').notEmpty();
    // req.checkBody('vendor_id', 'Driver_id must have id required!').notEmpty();
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

        var total_ratings = null;
        var total_reviews = null;
        //--- review for vendor--------------------------//
        if (req.body.vendor_id!="null") {
            Reviews.create({
                rating: req.body.rating,
                discription: req.body.discription,
                trip_id: req.body.trip_id,
                vendor_id: null,
                customer_id:null,
                driver_id: req.body.driver_id
            }).then(reviews => {

                Vendor.findOne({
                    where: {
                        id: req.body.vendor_id
                    }
                }).then(vendor_rating => {
                    total_ratings = parseFloat(vendor_rating.total_rating);
                    total_reviews = parseFloat(vendor_rating.total_review);
                    total_ratings = total_ratings + parseFloat(req.body.rating);
                    total_reviews = total_reviews + 1;
                    Vendor.update({
                        total_rating: total_ratings,
                        total_review: total_reviews
                    }, {
                        where: { id: req.body.vendor_id },
                        returning: true,
                        plain: true
                    }).then(updated_reviews => {
                        return res.status(200).send({
                            status: 200,
                            message: "Create driver review for vendor is successful",
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

        //--- review for Customer--------------------------//
         if (req.body.customer_id!="null") {


            // Save Review to Database
            Reviews.create({
                rating: req.body.rating,
                discription: req.body.discription,
                trip_id: req.body.trip_id,
                vendor_id: null,
                customer_id:null,
                driver_id: req.body.driver_id,
            }).then(reviews => {

                Customer.findOne({
                    where: {
                        id: req.body.customer_id
                    }
                }).then(customer_rating => {
                    total_ratings = parseFloat(customer_rating.total_rating);
                    total_reviews = parseFloat(customer_rating.total_review);
                    total_ratings = total_ratings + parseFloat(req.body.rating);
                    total_reviews = total_reviews + 1;
                    Customer.update({
                        total_rating: total_ratings,
                        total_review: total_reviews
                    }, {
                        where: { id: req.body.customer_id },
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
 }

//--------------------driver get vendor review from trip------------------------------
exports.get_review = (req, res) => {
    req.checkBody('trip_id', 'Trip_id must have Id needed!').notEmpty();
    req.checkBody('driver_id', 'driver_id must have Id needed!').notEmpty();
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

        console.log("ERROR REVIEW 1")

        Reviews.findAll({
            where: {
                trip_id: req.body.trip_id,
                driver_id: req.body.driver_id
            }
        }).then(reviews => {
            console.log("ERROR REVIEW 2")

            if (reviews == null || reviews == '') {
                console.log("ERROR REVIEW 3")

                Trip.findOne({
                    where: {
                        id: req.body.trip_id
                    },
                    include: [
                        {
                            model: db.vendor
                        },
                        {
                            model: db.customer
                        }
                    ]
                }).then(trip => {
                    console.log("ERROR REVIEW 4")

                    if (trip != null || trip != '') {
                        delete trip.vendor.dataValues.password;
                        console.log("ERROR REVIEW 5")

                        return res.status(200).send({
                            status: 200,
                            message: "get driver reviews   is successful",
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
                            message: "get driver reviews  from trip and trip was not found in DB",
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
            } else {

                if (req.body.vendor_id != "null") {
                    //Vendors
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
                                                status: 400,
                                                message: "get driver reviews from trip was not found in DB",
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

                            })
                        }
                    });
                } if(req.body.customer_id!="null") {

                    //Customer
                    reviews.forEach(item => {
                        if (item.dataValues.customer_id != null) {//------------if customer is gave reviews to driver ------//////
                            Customer.findOne({
                                where: {
                                    id: item.dataValues.customer_id
                                }
                            }).then(customer => {
                                if (customer != null || customer != '') {

                                    delete customer.dataValues.password;
                                    delete customer.dataValues.id;
                                    delete customer.dataValues.account_info;
                                    delete customer.dataValues.fcm_token;

                                    // delete customer.dataValues.phone_number;

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
                                                    customer: customer.dataValues
                                                    ,
                                                    trip: trip.dataValues

                                                }
                                            });
                                        } else {
                                            return res.status(200).send({
                                                status: 400,
                                                message: "get driver reviews from trip was not found in DB",
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

                            })
                        }
                    });


                }

                Trip.findOne({
                    where: {
                        id: req.body.trip_id
                    },
                    include: [
                        {
                            model: db.vendor
                        },
                        {
                            model: db.customer
                        }
                    ]
                }).then(trip => {
                    if (trip != null || trip != '') {

                        delete trip.vendor.dataValues.password;
                        delete trip.customer.dataValues.password;


                        return res.status(200).send({
                            status: 200,
                            message: "get driver reviews   is successful",
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
                            message: "get driver reviews  from trip and trip was not found in DB",
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
