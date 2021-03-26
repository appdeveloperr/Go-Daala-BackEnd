const db = require("../../../models/api_models");
const Op = db.Sequelize.Op;
var Reviews = db.review;

//-------------------vendor create review for trip--------------------------------
exports.create_review = (req, res) => {
    req.checkBody('rating', 'Rating must have Number needed!').notEmpty();
    req.checkBody('discription', 'Discription must have needed!').notEmpty();
    req.checkBody('trip_id', 'Trip_id must have id required!').notEmpty();
    req.checkBody('vendor_id', 'Vendor_id must have id required!').notEmpty();
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
        Reviews.findOne({
            where: {
                trip_id: req.body.trip_id,
                vendor_id: null
            }
        }).then(reviews => {
            if (reviews) {
                Driver.findOne({
                    where: {
                        id: reviews.driver_id
                    }
                }).then(drivers => {
                    if (drivers) {
                        Trip.findOne({
                            where: {
                                id: req.body.trip_id
                            }
                        }).then(trip => {
                            if (trip) {
                                return res.status(200).send({
                                    status: 200,
                                    message: "get driver reviews   is successful",
                                    successData: {
                                        review: {
                                            id: reviews.id,
                                            rating: reviews.rating,
                                            discription: reviews.discription,

                                            trip_id: reviews.trip_id,
                                            driver_id: reviews.driver_id
                                        },
                                        driver: {
                                            driver_name: drivers.dataValues.first_name + " " + drivers.dataValues.last_name
                                        },
                                        trip: {
                                            trip: trip.dataValues
                                        }
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
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "get vendor reviews   is successful",
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
}