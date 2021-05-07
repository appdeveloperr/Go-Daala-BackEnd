const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver_lat_long = db.driver_lat_long;
const Driver = db.driver;
var Vendor = db.vendor;
var Cancel_trip = db.cancel_trip;
var Trip = db.trip;
var admin = require("../../../config/fcm_init").isFcm;
var Sequelize = require('sequelize');
const Op = db.Sequelize.Op;
//--------------driver receive trip---------------
exports.receive_trip = (req, res, next) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('driver_id', 'please provide driver id!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in receive Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        console.log("this is driver id:  " + req.body.driver_id);
        console.log("this is trip id:  " + req.body.trip_id);
        Trip.findOne({
            where: {
                id: req.body.trip_id
            }
        }).then(check_trip_is_accepted => {
            console.log("this is driver_id: " + check_trip_is_accepted.dataValues.driver_id)
            if (check_trip_is_accepted.dataValues.driver_id == null) {
                Trip.update({
                    driver_id: req.body.driver_id,
                    status: "wait",

                },
                    {
                        where: { id: req.body.trip_id },
                        returning: true,
                        plain: true
                    }).then(trip => {
                        if (trip != null || trip != '') {
                            Vendor.findOne({
                                where: {
                                    id: trip[1].vendor_id
                                }
                            }).then(vendor_info => {
                                delete vendor_info.dataValues.password;
                                Driver_lat_long.update({
                                    status: "unavailable"
                                }, {
                                    where: { driver_id: req.body.driver_id },
                                    returning: true,
                                    plain: true
                                }).then(update_lat_long_status => {
                                    return res.status(200).send({
                                        status: 200,
                                        message: "Driver receive trip  is successful",
                                        successData: {
                                            trip: {
                                                id: trip[1].id,
                                                pickup: trip[1].pickup,
                                                dropoff: trip[1].dropoff,

                                                pickup_lat: trip[1].pickup_lat,
                                                pickup_long: trip[1].pickup_long,

                                                dropoff_lat: trip[1].dropoff_lat,
                                                dropoff_long: trip[1].dropoff_long,
                                                vehicle_name: trip[1].vehicle_name,
                                                estimated_distance: trip[1].estimated_distance,
                                                estimated_time: trip[1].estimated_time,
                                                total_cost: trip[1].total_cost,
                                                driver_id: trip[1].driver_id,
                                                vendor_id: trip[1].vendor_id,
                                                status: trip[1].status
                                            },
                                            vendor: vendor_info
                                        }
                                    });
                                }).catch(err => {
                                    console.log("this is track no 2");
                                    return res.status(200).send({
                                        status: 400,
                                        message: err.message,
                                        successData: {}
                                    });

                                });


                            }).catch(err => {
                                console.log("this is track no 2");
                                return res.status(200).send({
                                    status: 400,
                                    message: err.message,
                                    successData: {}
                                });

                            });

                        } else {
                            console.log("this is track no 1");
                            return res.status(200).send({
                                status: 200,
                                message: "Driver receive trip  is successful",
                                successData: {
                                    trip: {

                                        trip

                                    }
                                }
                            });
                        }
                    }).catch(err => {
                        console.log("this is track no 2");
                        return res.status(200).send({
                            status: 400,
                            message: err.message,
                            successData: {}
                        });

                    });

            } else {
                console.log("this is track no 3");
                return res.status(200).json({
                    status: 400,
                    message: "Sorry this trip is not avalible right now!",
                    successData: {}
                });
            }
        }).catch(err => {
            console.log("this is track no 4");
            return res.status(200).send({
                status: 400,
                message: "This trip is not Exist in DB",
                successData: {}
            });

        });


    }
}

//--------------driver fair_calculation  trip---------------
exports.fair_calculation = (req, res) => {
    req.checkBody('description', 'description must have needed!').notEmpty();
    req.checkBody('total_cost', 'total_cost must have needed!').notEmpty();
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in fair calculation Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {

        Trip.update({
            description: req.body.description,
            total_cost: req.body.total_cost

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

                return res.status(200).send({
                    status: 200,
                    message: "fair calculation is successfully",
                    successData: {
                        trip: trip[1]
                    }
                });

            }).catch(err => {

                return res.status(200).send({
                    status: 400,
                    message: "error in fair calculations apis:" + err.message,
                    successData: {}
                });

            });


    }



}

//--------------driver trip_detail  trip---------------
exports.trip_detail = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in trip detail",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {

        Trip.findOne(
            {
                where:
                    { id: req.body.trip_id },
                include: [

                    {
                        model: db.vendor
                    }
                ]
            }).then(trip => {


                //  delete trip.vendor.dataValues.password;
                return res.status(200).send({
                    status: 200,
                    message: "trip detail is successfully",
                    successData: {
                        trip: trip.dataValues
                    }
                });





            }).catch(err => {

                return res.status(200).send({
                    status: 400,
                    message: "error in trip detail apis:" + err.message,
                    successData: {}
                });

            });


    }



}



//--------------driver cencal trip---------------
exports.cencal_trip = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('driver_id', 'please provide driver id!').notEmpty();

    req.checkBody('vendor_fcm', 'please provide vendor fcm!').notEmpty();
    req.checkBody('driver_fcm', 'please provide driver fcm!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in receive Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.update({
            driver_id: req.body.driver_id,
            status: "cencal",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {
                Cancel_trip.create({
                    trip_id: req.body.trip_id,
                    driver_id: req.body.driver_id,
                    vendor_id: null
                }).then(can_trip => {
                    Driver_lat_long.update({
                        status: "available"
                    }, {
                        where: { driver_id: req.body.driver_id },
                        returning: true,
                        plain: true
                    }).then(update_lat_long_status => {
                        var myarray = [];

                        myarray.push(try_to_parse(req.body.vendor_fcm));
                        myarray.push(try_to_parse(req.body.driver_fcm));

                        var payload = {
                            notification: {
                                title: "Driver  Cancel  The Trip",
                                body: trip[1].id.toString()
                            }
                        };

                        var options = {
                            priority: "high",
                            timeToLive: 60 * 60 * 24
                        };


                        admin.messaging().sendToDevice(myarray, payload, options)
                            .then(function (response) {

                                return res.status(200).send({
                                    status: 200,
                                    message: "Driver cencal trip  is successfull",
                                    successData: {
                                        trip: {
                                            id: trip[1].id,
                                            pickup: trip[1].pickup,
                                            dropoff: trip[1].dropoff,
                                            pickup_latitude: trip[1].pickup_latitude,
                                            pick_longitude: trip[1].pick_longitude,
                                            vehicle_name: trip[1].vehicle_name,
                                            estimated_distance: trip[1].estimated_distance,
                                            estimated_time: trip[1].estimated_time,
                                            total_cost: trip[1].total_cost,
                                            driver_id: trip[1].driver_id,
                                            vendor_id: trip[1].vendor_id,
                                            status: trip[1].status


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


            }).catch(err => {

                return res.status(200).send({
                    status: 400,
                    message: err.message,
                    successData: {}
                });

            });

    }
}


//--------------driver start trip---------------
exports.start_trip = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('driver_id', 'please provide driver id!').notEmpty();
    req.checkBody('vendor_fcm', 'please provide vendor_fcm!').notEmpty();
    req.checkBody('driver_fcm', 'please provide driver_fcm!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in receive Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.update({
            driver_id: req.body.driver_id,
            status: "start",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {
                var myarray = [];

                myarray.push(try_to_parse(req.body.vendor_fcm));
                myarray.push(try_to_parse(req.body.driver_fcm));

                var payload = {
                    notification: {
                        title: "Start trip",
                        body: trip[1].id.toString()
                    }
                };

                var options = {
                    priority: "high",
                    timeToLive: 60 * 60 * 24
                };


                admin.messaging().sendToDevice(myarray, payload, options)
                    .then(function (response) {
                        console.log("Successfully sent message:", response);
                        return res.status(200).send({
                            status: 200,
                            message: "Driver start trip  is successfull",
                            successData: {
                                trip: {
                                    id: trip[1].id,
                                    pickup: trip[1].pickup,
                                    dropoff: trip[1].dropoff,
                                    pickup_lat: trip[1].pickup_lat,
                                    pickup_long: trip[1].pickup_long,
                                    dropoff_lat: trip[1].dropoff_lat,
                                    dropoff_long: trip[1].dropoff_long,
                                    vehicle_name: trip[1].vehicle_name,
                                    estimated_distance: trip[1].estimated_distance,
                                    estimated_time: trip[1].estimated_time,
                                    total_cost: trip[1].total_cost,
                                    driver_id: trip[1].driver_id,
                                    vendor_id: trip[1].vendor_id,
                                    status: trip[1].status


                                }
                            }
                        });
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                        return res.status(200).send({
                            responsecode: 400,
                            notification: response.results[0]
                        })

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



//--------------driver end trip---------------
exports.end_trip = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('driver_id', 'please provide driver id!').notEmpty();
    req.checkBody('vendor_fcm', 'please provide vendor_fcm!').notEmpty();
    req.checkBody('driver_fcm', 'please provide driver_fcm!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in receive Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        var myarray = [];

        myarray.push(try_to_parse(req.body.vendor_fcm));
        myarray.push(try_to_parse(req.body.driver_fcm));

        var payload = {
            notification: {
                title: "Completed trip",
                body: req.body.trip_id.toString()
            }
        };

        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };


        admin.messaging().sendToDevice(myarray, payload, options)
            .then(function (response) {
                console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
                return res.status(200).send({
                    responsecode: 400,
                    notification: response.results[0]
                })

            });
        // Save vendor to Database
        Trip.update({
            driver_id: req.body.driver_id,
            status: "end",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

                Driver_lat_long.update({
                    status: "available"
                }, {
                    where: { driver_id: req.body.driver_id },
                    returning: true,
                    plain: true
                }).then(update_lat_long_status => {


                    return res.status(200).send({
                        status: 200,
                        message: "Driver end trip  is successfull",
                        successData: {
                            trip: {
                                id: trip[1].id,
                                pickup: trip[1].pickup,
                                dropoff: trip[1].dropoff,
                                pickup_latitude: trip[1].pickup_latitude,
                                pick_longitude: trip[1].pick_longitude,
                                vehicle_name: trip[1].vehicle_name,
                                estimated_distance: trip[1].estimated_distance,
                                estimated_time: trip[1].estimated_time,
                                total_cost: trip[1].total_cost,
                                driver_id: trip[1].driver_id,
                                vendor_id: trip[1].vendor_id,
                                status: trip[1].status


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

    }
}



function try_to_parse(token) {
    try {
        return JSON.parse(token);
    } catch (e) {
        return token;
    }
}


//--------------driver Get  all  Trip ---------------
exports.get_all_trips = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get all Trips",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.findAll({
            where: {
                driver_id: req.body.driver_id
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip == null || trip == '') {
                return res.status(200).send({
                    status: 400,
                    message: "All trips was not found in DB!",
                    successData: {
                    }
                });
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "Get driver   all  Trip ",
                    successData: {
                        trip_list: trip
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


//--------------driver all cancel trips---------------
exports.all_cancel_trip = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in  driver all cancel trips",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.findAll({
            where: {
                driver_id: req.body.driver_id,
                status: "cencal"
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip != null || trip != '') {
                return res.status(200).send({
                    status: 200,
                    message: "Get all cancel driver   Trip",
                    successData: {
                        all_cancel_trip: {

                            all_cancel_trips_list: trip
                        }
                    }
                });
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "Get all cancel driver   Trip",
                    successData: {
                        trip: {
                        }
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


//--------------driver get_all_trips_with_cash   Trip ---------------
exports.get_all_trips_with_cash = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get all Trips",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.findAll({
            where: {
                driver_id: req.body.driver_id
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip == null || trip == '') {
                return res.status(200).send({
                    status: 400,
                    message: "Sorry no trip is here!",
                    successData: {
                    }
                });
            } else {
                var total_cash = 0;
                var total_trips = 0;
                trip.forEach(element => {
                    total_cash = total_cash + parseInt(element.total_cost);
                    total_trips = total_trips + 1;
                });
                return res.status(200).send({
                    status: 200,
                    message: "Get driver all Trips with cash ",
                    successData: {
                        dash_board_detail: {
                            total_trips: total_trips,
                            total_cash: total_cash
                        }
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


//--------------driver get_selected_date_with_cash  Trip ---------------
exports.get_selected_date_with_cash = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    req.checkBody('start', 'start date must have required!').notEmpty();
    req.checkBody('end', 'end date must have required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get_selected_date_with_cash",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.findAll({
            where: {
                driver_id: req.body.driver_id,
                createdAt: {
                    [Op.between]: [req.body.start, req.body.end],
                },
            },
            order: [['createdAt', 'ASC']],
            // limit: count,

        }).then(trip => {
            if (trip == null || trip == '') {
                return res.status(200).send({
                    status: 400,
                    message: "Sorry no trip is here!",
                    successData: {
                    }
                });
            } else {
                var total_cash = 0;
                var total_trips = 0;
                trip.forEach(element => {
                    total_cash = total_cash + parseInt(element.total_cost);
                    total_trips = total_trips + 1;
                });
                return res.status(200).send({
                    status: 200,
                    message: "Get driver date from to date Trip with cash",
                    successData: {
                        dash_board_detail: {
                            total_trips: total_trips,
                            total_cash: total_cash
                        }
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

//--------------driver get_single_date_with_cash  Trip ---------------
exports.get_single_date_with_cash = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    req.checkBody('Date', 'date must have required!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get_single_date_with_cash",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        
        Trip.findAll({
            where: {
                driver_id: req.body.driver_id,
                createdAt: 
                    Sequelize.DATE(req.body.Date),
                
             }
            //,
            // order: [['createdAt', 'ASC']],
            // limit: count,

        }).then(trip => {
            if (trip == null || trip == '') {
                return res.status(200).send({
                    status: 400,
                    message: "Sorry no trip is here!",
                    successData: {
                    }
                });
            } else {
                var total_cash = 0;
                var total_trips = 0;
                trip.forEach(element => {
                    total_cash = total_cash + parseInt(element.total_cost);
                    total_trips = total_trips + 1;
                });
                return res.status(200).send({
                    status: 200,
                    message: "Get driver for single date Trip with cash",
                    successData: {
                        dash_board_single_detail: {
                            total_trips: total_trips,
                            total_cash: total_cash
                        }
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




