const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver_lat_long = db.driver_lat_long;
const Driver = db.driver;
var Vendor = db.vendor;
var Cancel_trip = db.cancel_trip;
var Trip = db.trip;
var admin = require("../../../config/fcm_init").isFcm;
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
                                body: ""
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
                        body: ""
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
                body: ""
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
            if(trip==null || trip==''){
                return res.status(200).send({
                    status: 400,
                    message: "All trips was not found in DB!",
                    successData: {
                    }
                });
            }else{
            return res.status(200).send({
                status: 200,
                message: "Get driver   all  Trip ",
                successData: {
                    trip_list:trip   
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