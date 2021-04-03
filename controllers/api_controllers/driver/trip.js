const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver = db.driver;
var Vendor = db.vendor;
var Cancel_trip =db.cancel_trip;
var Trip = db.trip;

//--------------driver receive trip---------------
exports.receive_trip = (req, res) => {
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
        console.log("this is driver id:  "+req.body.driver_id);
        console.log("this is trip id:  "+req.body.trip_id);
        Trip.update({
            driver_id: req.body.driver_id,
            status: "wait",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {
                if(trip!=null  || trip!=''){
                return res.status(200).send({
                    status: 200,
                    message: "Driver receive trip  is successful",
                    successData: {
                        trip: {
                            id: trip[1].id,
                            pickup: trip[1].pickup,
                            dropoff: trip[1].dropoff,
                          
                            pickup_latitude: trip[1].pickup_lat,
                            pickup_longitude: trip[1].pickup_long,

                            dropoff_latitude:trip[1].dropoff_lat,
                            dropoff_longitude:trip[1].dropoff_long,
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
            }else{
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

                return res.status(200).send({
                    status: 400,
                    message: err.message,
                    successData: {}
                });

            });

    }
}


//--------------driver cencal trip---------------
exports.cencal_trip = (req, res) => {
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
                    trip_id:req.body.trip_id,
                    driver_id:req.body.driver_id,
                    vendor_id:null
                }).then(can_trip => {
                  
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

    }
}


//--------------driver start trip---------------
exports.start_trip = (req, res) => {
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
        Trip.update({
            driver_id: req.body.driver_id,
            status: "start",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

                return res.status(200).send({
                    status: 200,
                    message: "Driver start trip  is successfull",
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

    }
}



//--------------driver end trip---------------
exports.end_trip = (req, res) => {
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
        Trip.update({
            driver_id: req.body.driver_id,
            status: "end",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

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

    }
}

//--------------driver recent  all trip---------------
exports.recent_trip = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in recent Trip",
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
            }
        }).then(trip => {
            return res.status(200).send({
                status: 200,
                message: "Get driver recent  Trip",
                successData: {
                    trip_list: {
                       trip

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

