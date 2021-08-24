const db = require("../../../models/api_models");
const Trip = db.trip;
const driver_lat_long = db.driver_lat_long;
var Driver = db.driver;
var Vendor = db.vendor;
var Customer = db.customer;
const Cancel_trip = db.cancel_trip;
var Vehicle = db.vehicle_reg;
var fs = require('fs');
var path = require('path');
const Op = db.Sequelize.Op;
var admin = require("../../../config/fcm_init").isFcm;
const axios = require('axios');
const { user, driver, vendor, cencal_trip } = require("../../../models/api_models");



//--------------vendor create trip---------------
exports.create_trip = (req, res) => {
    req.checkBody('pickup', 'pickup must have value!').notEmpty();
    req.checkBody('dropoff', 'dropoff must have value!').notEmpty();
    req.checkBody('dropoff_lat', 'dropoff_lat must have value!').notEmpty();
    req.checkBody('dropoff_long', 'dropoff_long must have value!').notEmpty();
    req.checkBody('pickup_latitude', 'pickup_latitude must have value!').notEmpty();
    req.checkBody('pick_longitude', 'pick_longitude must have value!').notEmpty();
    req.checkBody('vehicle_type', 'vehicle name must have value!').notEmpty();
    req.checkBody('estimated_distance', 'estimated_distance must have value!').notEmpty();
    req.checkBody('estimated_time', 'estimated_time must have value!').notEmpty();
    req.checkBody('total_cost', 'total_cost must have value!').notEmpty();
    req.checkBody('vendor_id', 'vendor_id must have ID!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Create Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {

        // Save trips to Database
        Trip.create({
            pickup: req.body.pickup,
            dropoff: req.body.dropoff,
            dropoff_lat: req.body.dropoff_lat,
            dropoff_long: req.body.dropoff_long,
            pickup_lat: req.body.pickup_latitude,
            pickup_long: req.body.pick_longitude,
            vehicle_name: req.body.vehicle_type,
            estimated_distance: req.body.estimated_distance,
            estimated_time: req.body.estimated_time,
            total_cost: req.body.total_cost,
            driver_id: null,
            vendor_id: req.body.vendor_id,
            status: 'wait',
            description: ""

        }).then(trip => {
            var obj = new Array();
            var obj2 = new Array();
            var fcm_array = new Array();

            // var centerPoint = { lat: 31.571868, lng: 74.3309312 }; // office lat long 
            // var centerPoint = { lat: 31.506432, lng: 74.32437759999999 }; // model town lat long
            var centerPoint = { lat: req.body.pickup_latitude, lng: req.body.pick_longitude };

            Driver.findAll({
                where: {
                    account_info: "unblock",
                    status: "active"
                }
            }).then(function (driver) {
                if (driver != null || driver != '') {

                    Vehicle.findAll({
                        where: {
                            vehicle_type: req.body.vehicle_type
                        }
                    }).then(spacific_Vehicle => {
                        if (spacific_Vehicle != null && spacific_Vehicle != "") {

                            driver_lat_long.findAll({
                                where:
                                    { status: "available" }
                            }).then(function (Loc) {

                                if (Loc != null || Loc != '') {
                                    for (var i = 0; i < Loc.length; i++) {
                                        spacific_Vehicle.forEach(spacific_vehi => {
                                            if ((Loc[i].driver_id == spacific_vehi.driver_id) && (spacific_vehi.vehicle_type == req.body.vehicle_type)) {
                                                var checkPoint = { lat: Loc[i].latitude, lng: Loc[i].longitude };
                                                var n = arePointsNear(checkPoint, centerPoint, 5);
                                                if (n == true && Loc[i].dataValues.driver_id != null) {

                                                    obj.push(Loc[i].dataValues);
                                                }
                                            }
                                        });
                                    }


                                    var unit = "K";
                                    for (var i = 0; i < obj.length; i++) {
                                        driver.forEach(driv => {
                                            if (obj[i].driver_id == driv.id) {
                                                var n = distance(centerPoint.lat, centerPoint.lng, obj[i].latitude, obj[i].longitude, unit);
                                                obj[i].distance = n;
                                                obj[i].fcm_token = driv.fcm_token;
                                                obj2.push(obj[i]);
                                                fcm_array.push(try_to_parse(driv.fcm_token));

                                            }
                                        });
                                    }

                                    obj2.sort(function (a, b) {
                                        var alc = a.distance, blc = b.distance;
                                        return alc > blc ? 1 : alc < blc ? -1 : 0;
                                    });

                                    console.log("Total drivers:" + obj2.length);
                                    console.log("trip id :" + trip.id);
                                    // old code sending fcm one by one 

                                    // if (obj2.length > 0) {
                                    //     var payload = {
                                    //         notification: {
                                    //             title: "trip_id",
                                    //             body: trip.id.toString()
                                    //         },
                                    //         data:{
                                    //             title: "trip_id",
                                    //             body: trip.id.toString()
                                    //         }
                                    //     };

                                    //     var options = {
                                    //         priority: "high",
                                    //         timeToLive: 60 * 60 * 24
                                    //     };
                                    //     var intervalObj = null;
                                    //     var temp = 1;
                                    //     var time = 5000;
                                    //     var fcm_token = null;
                                    //     admin.messaging().sendToDevice(try_to_parse(obj2[0].fcm_token), payload, options)
                                    //         .then(function (response) {
                                    //             console.log("Successfully sent message:", response);
                                    //             intervalObj = setInterval(function () {

                                    //                 if (temp < obj2.length) {
                                    //                     Trip.findOne({
                                    //                         where: {
                                    //                             id: trip.id
                                    //                         }
                                    //                     }).then((is_accepted_trip) => {
                                    //                         if (!is_accepted_trip.dataValues.driver_id) {

                                    //                             admin.messaging().sendToDevice(try_to_parse(obj2[temp].fcm_token), payload, options)
                                    //                                 .then(function (response) {
                                    //                                     console.log("Successfully sent message:", response);

                                    //                                 })
                                    //                                 .catch(function (error) {
                                    //                                     console.log("Error sending message:", error);
                                    //                                     return res.status(200).send({
                                    //                                         responsecode: 400,
                                    //                                         notification: response.results[0]
                                    //                                     })

                                    //                                 });


                                    //                             temp = temp + 1;

                                    //                         } else {
                                    //                             var check_driver_lat_long = null;
                                    //                             for (var i = 0; i < obj2.length; i++) {
                                    //                                 if (obj2[i].driver_id == is_accepted_trip.dataValues.driver_id) {
                                    //                                     check_driver_lat_long = i;
                                    //                                 }
                                    //                             }
                                    //                             Driver.findOne({
                                    //                                 where: {
                                    //                                     id: is_accepted_trip.dataValues.driver_id
                                    //                                 }
                                    //                             }).then(driver_data => {
                                    //                                 delete driver_data.dataValues.password;

                                    //                                 Vehicle.findOne({
                                    //                                     where: {
                                    //                                         driver_id: driver_data.dataValues.id
                                    //                                     }
                                    //                                 }).then(vehicle_info => {
                                    //                                     return res.status(200).send({
                                    //                                         status: 200,
                                    //                                         message: "Create Trip with accepted drivers is successful",
                                    //                                         successData: {
                                    //                                             request_trip: trip,
                                    //                                             accepted_driver: driver_data,
                                    //                                             driver_current_location: {
                                    //                                                 latitude: obj2[check_driver_lat_long].latitude,
                                    //                                                 longitude: obj2[check_driver_lat_long].longitude
                                    //                                             },
                                    //                                             driver_vehicle_info: vehicle_info

                                    //                                         }
                                    //                                     });
                                    //                                 }).catch(err => {
                                    //                                     console.log("track 1");
                                    //                                     return res.status(200).send({
                                    //                                         status: 400,
                                    //                                         message: err.message,
                                    //                                         successData: {}
                                    //                                     });

                                    //                                 });


                                    //                             }).catch(err => {
                                    //                                 console.log("track 2");
                                    //                                 return res.status(200).send({
                                    //                                     status: 400,
                                    //                                     message: err.message,
                                    //                                     successData: {}
                                    //                                 });

                                    //                             });


                                    //                             //------ if any driver is accept to trip then stop fcm-------//

                                    //                             clearInterval(intervalObj);


                                    //                         }
                                    //                     }).catch(err => {
                                    //                         console.log("track 3");
                                    //                         return res.status(200).send({
                                    //                             status: 400,
                                    //                             message: err.message,
                                    //                             successData: {}
                                    //                         });

                                    //                     });

                                    //                 }
                                    //                 //----------- length is less then and stop loop fcm ------
                                    //                 else {

                                    //                     clearInterval(intervalObj);
                                    //                     Trip.findOne({
                                    //                         where: {
                                    //                             id: trip.id
                                    //                         }
                                    //                     }).then(function (checking_anyone_accept) {
                                    //                         if (!checking_anyone_accept.dataValues.driver_id) {

                                    //                             //--------Delete Trip after no one is accept-----//
                                    //                             Trip.destroy({
                                    //                                 where: {
                                    //                                     id: trip.id
                                    //                                 }
                                    //                             }).then(removedTrip => {


                                    //                                 return res.status(200).send({
                                    //                                     status: 400,
                                    //                                     message: "All the drivers are busy please try again",
                                    //                                     successData: {}
                                    //                                 });


                                    //                             }).catch(err => {
                                    //                                 console.log("track 4");
                                    //                                 return res.status(200).send({
                                    //                                     status: 400,
                                    //                                     message: err.message,
                                    //                                 });
                                    //                             });

                                    //                         } else {

                                    //                             var check_driver_lat_long = null;
                                    //                             for (var i = 0; i < obj2.length; i++) {
                                    //                                 if (obj2[i].driver_id == checking_anyone_accept.dataValues.driver_id) {
                                    //                                     check_driver_lat_long = i;
                                    //                                 }
                                    //                             }
                                    //                             Driver.findOne({
                                    //                                 where: {
                                    //                                     id: checking_anyone_accept.dataValues.driver_id
                                    //                                 }
                                    //                             }).then(driver_data => {
                                    //                                 delete driver_data.dataValues.password;
                                    //                                 Vehicle.findOne({
                                    //                                     where: {
                                    //                                         driver_id: driver_data.dataValues.id
                                    //                                     }
                                    //                                 }).then(vehicle_info => {
                                    //                                     return res.status(200).send({
                                    //                                         status: 200,
                                    //                                         message: "Create Trip with accepted drivers  is successful",
                                    //                                         successData: {
                                    //                                             request_trip: trip,
                                    //                                             accepted_driver: driver_data,
                                    //                                             driver_current_location: {
                                    //                                                 latitude: obj2[check_driver_lat_long].latitude,
                                    //                                                 longitude: obj2[check_driver_lat_long].longitude
                                    //                                             },
                                    //                                             driver_vehicle_info: vehicle_info

                                    //                                         }
                                    //                                     });

                                    //                                 }).catch(err => {
                                    //                                     console.log("track 5");
                                    //                                     return res.status(200).send({
                                    //                                         status: 400,
                                    //                                         message: err.message,
                                    //                                         successData: {}
                                    //                                     });

                                    //                                 });


                                    //                             }).catch(err => {
                                    //                                 console.log("track 6");
                                    //                                 return res.status(200).send({
                                    //                                     status: 400,
                                    //                                     message: err.message,
                                    //                                     successData: {}
                                    //                                 });

                                    //                             });

                                    //                         }
                                    //                     })

                                    //                 };

                                    //             }, time);

                                    //         })
                                    //         .catch(function (error) {
                                    //             console.log("Error sending message:", error);
                                    //             return res.status(200).send({
                                    //                 responsecode: 400,
                                    //                 notification: response.results[0]
                                    //             });
                                    //         });


                                    // } else {
                                    //     return res.status(200).send({
                                    //         status: 400,
                                    //         message: "No driver is exist in your around",
                                    //         successData: {}
                                    //     });

                                    // }



                                    // new code sending fcm every one at a time 
                                    if (obj2.length > 0) {
                                        console.log('total drivers: '+obj2.length);
                                        console.log('fcm array: '+fcm_array);
                                        var payload = {
                                    
                                            data: {
                                                title: "trip_id",
                                                body: trip.id.toString()
                                            }
                                        };

                                        var options = {
                                            priority: "high",
                                            timeToLive: 60 * 60 * 24
                                        };

                                        admin.messaging().sendToDevice(fcm_array, payload, options)
                                            .then(function (response) {
                                                console.log("Successfully sent fcm:", response);
                                                var time = 5000
                                                const intervalObj = setInterval(() => {
                                                    if (time <= 40000) {
                                                        Trip.findOne({
                                                            where: {
                                                                id: trip.id
                                                            }
                                                        }).then((is_accepted_trip) => {
                                                            if (is_accepted_trip.dataValues.driver_id) { //true condition any driver is accepted
                                                                var check_driver_lat_long = null;

                                                                for (var i = 0; i < obj2.length; i++) {
                                                                    if (obj2[i].driver_id == is_accepted_trip.dataValues.driver_id) {
                                                                        check_driver_lat_long = i;
                                                                    }
                                                                }
                                                                Driver.findOne({
                                                                    where: {
                                                                        id: is_accepted_trip.dataValues.driver_id
                                                                    }
                                                                }).then(driver_data => {
                                                                    delete driver_data.dataValues.password;

                                                                    Vehicle.findOne({
                                                                        where: {
                                                                            driver_id: driver_data.dataValues.id
                                                                        }
                                                                    }).then(vehicle_info => {
                                                                        return res.status(200).send({
                                                                            status: 200,
                                                                            message: "Create Trip with accepted drivers is successful",
                                                                            successData: {
                                                                                request_trip: trip,
                                                                                accepted_driver: driver_data,
                                                                                driver_current_location: {
                                                                                    latitude: obj2[check_driver_lat_long].latitude,
                                                                                    longitude: obj2[check_driver_lat_long].longitude
                                                                                },
                                                                                driver_vehicle_info: vehicle_info

                                                                            }
                                                                        });
                                                                    }).catch(err => {
                                                                        console.log("track 1");
                                                                        return res.status(200).send({
                                                                            status: 400,
                                                                            message: err.message,
                                                                            successData: {}
                                                                        });

                                                                    });


                                                                }).catch(err => {
                                                                    console.log("track 2");
                                                                    return res.status(200).send({
                                                                        status: 400,
                                                                        message: err.message,
                                                                        successData: {}
                                                                    });

                                                                });


                                                                //------ if any driver is accept to trip then stop loop for waiting response-------//

                                                                clearInterval(intervalObj);


                                                            }

                                                        });
                                                        time = time + 5000;
                                                    } else {
                                                        
                                                      
                                                        //--------Delete Trip after no one is accept-----//
                                                        Trip.destroy({
                                                            where: {
                                                                id: trip.id
                                                            }
                                                        }).then(removedTrip => {
                                                            console.log('object is distory and trip_id: '+trip.id);
                                                            return res.status(200).send({
                                                                status: 400,
                                                                message: "All the drivers are busy please try again",
                                                                successData: {}
                                                            });


                                                        }).catch(err => {
                                                            console.log("track 4");
                                                            return res.status(200).send({
                                                                status: 400,
                                                                message: err.message,
                                                            });
                                                        });
                                                        clearInterval(intervalObj);
                                                    }


                                                }, time);
                                            })
                                            .catch(function (error) {
                                                console.log("Error sending message:", error);
                                                return res.status(200).send({
                                                    responsecode: 400,
                                                    notification: response.results[0]
                                                })

                                            });

                                    } else {
                                        return res.status(200).send({
                                            status: 400,
                                            message: "No driver is exist in your around",
                                            successData: {}
                                        });
                                    }
                                }
                            }).catch(err => {
                                console.log("track 7");
                                return res.status(200).send({
                                    status: 400,
                                    message: err.message,
                                    successData: {}
                                });

                            });
                        } else {
                            return res.status(200).send({
                                status: 400,
                                message: "Your select Vehicle in not in db",
                                successData: {}
                            });

                        }

                    }).catch(err => {
                        console.log("track 8");
                        return res.status(200).send({
                            status: 400,
                            message: err.message,
                            successData: {}
                        });

                    });




                }
            }).catch(err => {
                console.log("track 9");
                return res.status(200).send({
                    status: 400,
                    message: err.message,
                    successData: {}
                });

            });


        }).catch(err => {
            console.log("track 10");
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





exports.test = function (req, res) {
    const timeoutObj = setTimeout(() => {
        console.log('timeout beyond time');
    }, 5000);

}


//-------------vendor test lat long ------------
exports.test_lat_log = function (req, res) {

    var time = 5000
    const intervalObj = setInterval(() => {
        if (time <= 60000) {
            
            console.log('interviewing the interval time = ' + time);
            time = time + 5000;
        } else {
            clearInterval(intervalObj);
        }
    }, time);


}


function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}



//--------------vendor Get  all  Trip  ---------------
exports.get_all_trips = (req, res) => {
    req.checkBody('vendor_id', 'vendor_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Get vendor all  Trip",
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
                vendor_id: req.body.vendor_id
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip != null || trip != '') {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor all  Trip",
                    successData: {
                        trips: trip

                    }
                });
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor all  Trips was not found in DB!",
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


//--------------vendor all cancel trips---------------
exports.all_cancel_trip = (req, res) => {
    req.checkBody('vendor_id', 'vendor_id must have ID!').notEmpty();
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
                vendor_id: req.body.vendor_id,
                status: "cencal"
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip != null || trip != '') {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor recent  Trip",
                    successData: {
                        all_cancel_trip: {

                            all_cancel_trips_list: trip
                        }
                    }
                });
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor recent  Trip",
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



//--------------vendor all cancel trips---------------
exports.all_ongoing_trip = (req, res) => {
    req.checkBody('vendor_id', 'vendor_id must have ID!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in all_ongoing_trip ",
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
                vendor_id: req.body.vendor_id,
                [Op.or]: [
                    {
                        status: "start"
                    },
                    {
                        status: "wait"
                    }

                ]
            },
            order: [
                ['id', 'DESC'],
            ],
        }).then(trip => {
            if (trip != null || trip != '') {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor all_ongoing  Trip",
                    successData: {
                        all_ongoing_trip: {

                            all_ongoing_trips_list: trip
                        }
                    }
                });
            } else {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor recent  Trip",
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
//--------------vendor cencal trip---------------
exports.cancel_trip = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('vendor_id', 'please provide vendor id!').notEmpty();
    req.checkBody('vendor_fcm', 'please provide vendor fcm!').notEmpty();
    req.checkBody('driver_fcm', 'please provide driver fcm!').notEmpty();
    req.checkBody('price', 'please provide price').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Cancel Trip",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Trip.update({
            vendor_id: req.body.vendor_id,
            status: "cancel",
            how_cancel: "vendor",
            total_cost: req.body.price

        },
            {
                where: { id: req.body.trip_id },

                returning: true,
                plain: true
            }).then(trip => {
                Cancel_trip.create({
                    trip_id: req.body.trip_id,
                    vendor_id: req.body.vender_id,
                    driver_id: null
                }).then(can_trip => {

                    driver_lat_long.update({
                        status: "available"
                    }, {
                        where: { driver_id: trip[1].driver_id },
                        returning: true,
                        plain: true
                    }).then(update_lat_long_status => {
                        var myarray = [];

                        //------------ if customer id exist in trip then find the customer and  get fcm----------
                        if (trip[1].customer_id != null && trip[1].customer_id != '') {
                            Customer.findOne({
                                where: {
                                    id: trip[1].customer_id
                                }
                            }).then(customer => {

                                //------------ if customer is exist in customer table then get customer fcm ---------//

                                if (customer != null && customer != '') {
                                    myarray.push(try_to_parse(customer.dataValues.fcm_token));
                                    myarray.push(try_to_parse(req.body.vendor_fcm));
                                    myarray.push(try_to_parse(req.body.driver_fcm));

                                    var payload = {
                                      data: {
                                            title: "Vendor Cancel Trip",
                                            body: trip[1].id.toString(),
                                            price: req.body.price.toString()
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
                                                message: "Vendor cencal trip  is successfull",
                                                successData: {
                                                    trip: trip[1]
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


                                }

                            }).catch(err => {

                                return res.status(200).send({
                                    status: 400,
                                    message: "error in finding a customer catch :" + err.message,
                                    successData: {}
                                });

                            });

                        }


                        //------customer id not exit in trip table----------------
                        else {
                            myarray.push(try_to_parse(req.body.vendor_fcm));
                            myarray.push(try_to_parse(req.body.driver_fcm));

                            var payload = {
                              data: {
                                    title: "Vendor Cancel Trip",
                                    body: trip[1].id.toString(),
                                    price:req.body.price.toString()
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
                                        message: "Vendor cencal trip  is successfull",
                                        successData: {
                                            trip: trip[1]
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
                        }

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


//--------------vendor trip_detail  trip---------------
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
                        model: db.driver
                    }, {
                        model: db.vendor
                    },{
                        model:db.customer
                    }
                ]
            }).then(trip => {
                if(trip.dataValues.driver_id){
                    driver_lat_long.findOne({where:{
                        driver_id:trip.dataValues.driver_id
                    }}).then(Driver_lat_long=>{
                        if(Driver_lat_long){
                            return res.status(200).send({
                                status: 200,
                                message: "trip detail is successfully",
                                successData: {
                                    trip: trip.dataValues,
                                    Driver_lat_long:Driver_lat_long.dataValues
                                }
                            });
                        }else{
                            return res.status(200).send({
                                status: 200,
                                message: "trip detail is successfully",
                                successData: {
                                    trip: trip.dataValues,
                                    Driver_lat_long:''
                                }
                            });
                        }
                    }).catch(err => {

                        return res.status(200).send({
                            status: 400,
                            message: "error in trip detail api gating driver lat long:" + err.message,
                            successData: {}
                        });
        
                    });
                }else{
                    return res.status(200).send({
                        status: 200,
                        message: "trip detail is successfully",
                        successData: {
                            trip: trip.dataValues,
                            Driver_lat_long:''
                        }
                    });
                }
          
            }).catch(err => {

                return res.status(200).send({
                    status: 400,
                    message: "error in trip detail apis:" + err.message,
                    successData: {}
                });

            });


    }



}


//------------vendor share  trip to another person Function----------------
exports.trip_share = (req, res) => {
    req.checkBody('mobile_no', 'please provide mobile number!').notEmpty();
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in trip share",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        //------------------vendor Send message to another person for share trip ------------------------------------
        var message = req.body.trip_id + "/" + req.body.mobile_no.toString() + "\n" + "Download App:  https://play.google.com/store/apps/details?id=com.techreneur.godaalavendor";
        var messageData = "Track your trip by using following link: " + "\n" + " Track Your Trip : http://www.godaala.com/trip?trip_id=" + message;
        var mobileno = req.body.mobile_no;

        axios.get('http://api.veevotech.com/sendsms?hash=2fefa107d5eddd16fc16e420e976b2eb&receivenum=' + mobileno + '&sendernum=8583&textmessage=' + messageData)
            .then(response => {
                console.log("massage sent is successfully");

                Customer.findOne({
                    where: {
                        phone_number: mobileno
                    }
                }).then(user => {

                    if (user) {
                        console.log("this is fcm : " + user.dataValues.fcm_token);
                        var payload = {
                          data: {
                                title: "Share Trip",
                                body: req.body.trip_id.toString(),
<<<<<<< HEAD
                                phone_number:mobileno.toString()
=======
                                mobileno: mobileno.toString()
>>>>>>> ea08a97b9c9ecc1f57e6f849087cf494ce9b3d11
                            }
                        };

                        var options = {
                            priority: "high",
                            timeToLive: 60 * 60 * 24
                        };

                        admin.messaging().sendToDevice(try_to_parse(user.dataValues.fcm_token), payload, options)
                            .then(function (response) {
                                console.log("FCM Successfully sent message:");
                                Trip.update({
                                    customer_id: user.dataValues.id
                                }, {
                                    where:
                                        { id: req.body.trip_id },
                                    returning: true,
                                    plain: true
                                }).then(trip => {
                                    if (trip) {
                                        return res.status(200).send({
                                            status: 200,
                                            message: "Successfully sent message",
                                            successData: {
                                            }
                                        });
                                    } else {
                                        return res.status(200).send({
                                            status: 200,
                                            message: "Successfully sent message",
                                            successData: {
                                            }
                                        });
                                    }

                                }).catch(function (error) {
                                    return res.status(200).send({
                                        status: 400,
                                        message: "Error in finding customer and send fcm notificion message: " + error,
                                        successData: {}
                                    });
                                });

                            })
                            .catch(function (error) {
                                console.log("Error sending message:", error);
                                return res.status(200).send({
                                    status: 400,
                                    notification: "Error sending message: " + response.results[0]
                                })

                            });



                    } else {
                        return res.status(200).send({
                            status: 400,
                            message: "This user phone number is not register",
                            successData: {}
                        });
                    }
                }).catch(err => {
                    console.log('track 1 ');
                    return res.status(200).send({
                        status: 400,
                        message: "This user phone number is not register",
                        successData: {}
                    });
                });
            })
            .catch(error => {
                console.log('track 2 ');
                return res.status(200).send({
                    status: 400,
                    message: "error in sending message: " + error
                });
            });






    }
}
//--------------vendor fair_calculation  trip---------------
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