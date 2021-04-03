const db = require("../../../models/api_models");
const Trip = db.trip;
const driver_lat_long = db.driver_lat_long;
var Driver = db.driver;
var Cancel_trip = db.cencel_trip;
var fs = require('fs');
var path = require('path');
var admin = require("firebase-admin");
var serviceAccount = require("../../../config/go-daala-prod-firebase-adminsdk-kx7hm-c8b83fe095.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://go-daala-prod-default-rtdb.firebaseio.com/"
});

//--------------vendor create trip---------------
exports.create_trip = (req, res) => {
    req.checkBody('pickup', 'pickup must have value!').notEmpty();
    req.checkBody('dropoff', 'dropoff must have value!').notEmpty();
    req.checkBody('dropoff_lat', 'dropoff_lat must have value!').notEmpty();
    req.checkBody('dropoff_long', 'dropoff_long must have value!').notEmpty();
    req.checkBody('pickup_latitude', 'pickup_latitude must have value!').notEmpty();
    req.checkBody('pick_longitude', 'pick_longitude must have value!').notEmpty();
    req.checkBody('vehicle_name', 'vehicle_name must have value!').notEmpty();
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


        var obj = new Array();
        var obj2 = new Array();
        // var centerPoint = { lat: 31.571868, lng: 74.3309312 }; // office lat long 
        // var centerPoint = { lat: 31.506432, lng: 74.32437759999999 }; // model town lat long
        var centerPoint = { lat: req.body.pickup_latitude, lng: req.body.pick_longitude };

        driver_lat_long.findAll().then(loc => {
            if (loc!=null|| loc!='') {
                loc.forEach(element => {
                    var checkPoint = { lat: element.latitude, lng: element.longitude };
                    var n = arePointsNear(checkPoint, centerPoint, 5);
                    if (n == true) {
                        obj.push(element.dataValues);
                    }
                });
                var unit = "K";
                obj.forEach(item => {
                    var n = distance(centerPoint.lat, centerPoint.lng, item.latitude, item.longitude, unit);

                    item.distance = n;
                    obj2.push(item);
                });
                obj2.sort(function (a, b) {
                    var alc = a.distance, blc = b.distance;
                    return alc > blc ? 1 : alc < blc ? -1 : 0;
                });



            }
        });




        // Save trips to Database
        Trip.create({
            pickup: req.body.pickup,
            dropoff: req.body.dropoff,
            dropoff_lat: req.body.dropoff_lat,
            dropoff_long: req.body.dropoff_long,
            pickup_lat: req.body.pickup_latitude,
            pickup_long: req.body.pick_longitude,
            vehicle_name: req.body.vehicle_name,
            estimated_distance: req.body.estimated_distance,
            estimated_time: req.body.estimated_time,
            total_cost: req.body.total_cost,
            driver_id: null,
            vendor_id: req.body.vendor_id,
            status: 'wait'

        }).then(trip => {
            var a = trip.id;
            var b = a.toString();
            var payload = {
                notification: {
                    title: "trip_id",
                    body: b
                }
            };
    
            var options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
            };
            admin.messaging().sendToDevice("fVWy_0MyRYKsd5JhGjHkdR:APA91bFTQH9X5mOUO9BGMUAsWzVpfQtr3541s3DqqRoyl8Y7nVfsAeNAP7Kb5ZDLwPl2ZuzrJ-Pqw8EK7nTdgSg-xufkjnMX_kJXoHpSnJSywUo8CrlMALrPHy8nopJ5hWHPVPuWk30t", payload, options)
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

            // https://go-daala-backend.herokuapp.com

            return res.status(200).send({
                status: 200,
                message: "Create Trip with nearest drivers  is successful",
                successData: {
                    request_trip: {
                        id: trip.id,
                        pickup: trip.pickup,
                        dropoff: trip.dropoff,

                        dropoff_lat: trip.dropoff_lat,
                        dropoff_long: trip.dropoff_long,


                        pickup_lat: trip.pickup_lat,
                        pickup_long: trip.pickup_long,
                        vehicle_name: trip.vehicle_name,
                        estimated_distance: trip.estimated_distance,
                        estimated_time: trip.estimated_time,
                        total_cost: trip.total_cost,
                        vendor_id: trip.vendor_id,
                        status: trip.status
                    },
                    closest_driver_lists: { closest_driver_list: obj2 }
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




//-------------vendor test lat long ------------
exports.test_lat_log = function (req, res) {
    var obj = new Array();
    var obj2 = new Array();
    // var centerPoint = { lat: 31.571868, lng: 74.3309312 }; // office lat long 
    var centerPoint = { lat: 31.506432, lng: 74.32437759999999 }; // model town lat long

    driver_lat_long.findAll().then(loc => {
        if (loc !=null|| locs!='') {
            loc.forEach(element => {
                var checkPoint = { lat: element.latitude, lng: element.longitude };
                var n = arePointsNear(checkPoint, centerPoint, 5);
                if (n == true) {
                    obj.push(element.dataValues);
                }
            });
            var unit = "K";
            obj.forEach(item => {
                var n = distance(centerPoint.lat, centerPoint.lng, item.latitude, item.longitude, unit);

                item.distance = n;
                obj2.push(item);
            });
            obj2.sort(function (a, b) {
                var alc = a.distance, blc = b.distance;
                return alc > blc ? 1 : alc < blc ? -1 : 0;
            });
            console.log(obj2);

        }
    })
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



//--------------vendor recent  all trip---------------
exports.recent_trip = (req, res) => {
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
                vendor_id: req.body.vendor_id
            }
        }).then(trip => {
            if (trip!=null|| trip!='') {
                return res.status(200).send({
                    status: 200,
                    message: "Get vendor recent  Trip",
                    successData: {
                        recent_trip: {

                            trips: trip
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
exports.cencal_trip = (req, res) => {
    req.checkBody('trip_id', 'please provide trip id!').notEmpty();
    req.checkBody('vendor_id', 'please provide vendor id!').notEmpty();
    
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
            vendor_id: req.body.vendor_id,
            status: "cencal",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {
                Cancel_trip.create({
                    trip_id:req.body.trip_id,
                    vendor_id:req.body.vender_id,
                    driver_id:null
                }).then(can_trip => {
                    return res.status(200).send({
                        status: 200,
                        message: "Vendor cencal trip  is successfull",
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
