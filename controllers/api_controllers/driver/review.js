const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
var Reviews = db.review;
var Vendor = db.vendor;

//-------------------vendor create review for trip--------------------------------
exports.create_review = (req, res) => {
    req.checkBody('rating', 'Rating must have Number needed!').notEmpty();
    req.checkBody('discription', 'Discription must have needed!').notEmpty();
    req.checkBody('trip_id', 'Trip_id must have id required!').notEmpty();
    req.checkBody('driver_id', 'Driver_id must have id required!').notEmpty();
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
        Reviews.findOne({
            where: {
                trip_id: req.body.trip_id,
                driver_id: null
            }
        }).then(reviews => {
            if (reviews) {
                
                Vendor.findOne({
                    where: {
                        id: reviews.vendor_id
                    }
                }).then(vendors => {
                    if (vendors) {
                        Trip.findOne({
                            where: {
                                id: req.body.trip_id
                            }
                        }).then(trip => {
                            if (trip) {

                                return res.status(200).send({
                                    status: 200,
                                    message: "get vonder reviews   is successful",
                                    successData: {
                                        review: {
                                            id: reviews.id,
                                            rating: reviews.rating,
                                            discription: reviews.discription,

                                            trip_id: reviews.trip_id,
                                            vendor_id: reviews.vendor_id
                                        },
                                        vendor: {
                                            vendor_name: vendors.dataValues.first_name + " " + vendors.dataValues.last_name
                                        },
                                        trip: {
                                            trip: trip.dataValues
                                        }
                                    }
                                });
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
