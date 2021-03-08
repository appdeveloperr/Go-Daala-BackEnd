const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Driver = db.driver;
const Vehicle_reg = db.vehicle_reg;
const Vehicle = db.vehicle;
const Trip = db.trip;
const Promo = db.promo;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require('fs');




//-------------vendor signup--------------------
exports.signup = (req, res) => {


    req.checkBody('first_name', 'first_name must have value!').notEmpty();
    req.checkBody('last_name', 'last name must have value!').notEmpty();
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Signing Up",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {
            req.checkBody('profile', 'profile picture must have needed!').notEmpty();
            req.checkBody('cnic', 'CNIC picture must have needed!').notEmpty();
            req.checkBody('driving_license', 'Driving License picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Signing Up",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('profile', 'profile picture must have needed animage').isImage(req.files.profile.name);
            req.checkBody('cnic', 'cnic picture must have needed animage').isImage(req.files.cnic.name);
            req.checkBody('driving_license', 'driving_license picture must have needed animage').isImage(req.files.driving_license.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Signing Up",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/vendor/';
                //-----------------move profile into server-------------------------------//
                req.files.profile.mv(path_file + '' + req.files.profile.name, function (err) {
                    if (err) console.log("error occured");
                });
                //-----------------move cnic into server-------------------------------//
                req.files.cnic.mv(path_file + '' + req.files.cnic.name, function (err) {
                    if (err) console.log("error occured");
                });
                //-----------------move driving_license into server-------------------------------//
                req.files.driving_license.mv(path_file + '' + req.files.driving_license.name, function (err) {
                    if (err) console.log("error occured");
                });
                // Save vendor to Database
                Driver.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: bcrypt.hashSync(req.body.password, 8),
                    profile: '/public/files/uploadsFiles/vendor/' + req.files.profile.name,
                    cnic: '/public/files/uploadsFiles/vendor/' + req.files.cnic.name,
                    driving_license: '/public/files/uploadsFiles/vendor/' + req.files.driving_license.name,
                    status: "deactive",
                    account_info: "block"
                }).then(user => {

                    var token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });



                    return res.status(200).send({
                        status: 200,
                        message: "Signing Up is successful",
                        successData: {
                            user: {
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                phone_number: user.phone_number,
                                profile: user.profile,
                                cnic: user.cnic,
                                driving_license: user.driving_license,
                                status: user.status,
                                account_info: user.account_info,
                                accessToken: token
                            }
                        }
                    });

                })
                    .catch(err => {

                        return res.status(200).send({
                            status: 400,
                            message: err.message,
                            successData: {}
                        });

                    });
            }
        }

    }
};


//--------------vendor signin-------------------
exports.signin = (req, res) => {
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in SignIN",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Driver.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {

                if (!user) {
                    return res.status(200).send({
                        status: 400,
                        message: "User email Not found.",
                        successData: {}
                    });
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid user Password!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });


                return res.status(200).send({
                    status: 200,
                    message: "Login Successfull.",
                    successData: {
                        user: {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            phone_number: user.phone_number,
                            profile: user.profile,
                            cnic: user.cnic,
                            driving_license: user.driving_license,
                            status: user.status,
                            account_info: user.account_info,
                            accessToken: token

                        }
                    }

                });

            })
            .catch(err => {
                return res.status(200).send({
                    status: 400,
                    message: err.message,
                    successData: {}
                });
            });
    }
};


//--------------Driver profile update---------------
exports.update = (req, res) => {
    req.checkBody('first_name', 'first_name must have value!').notEmpty();
    req.checkBody('last_name', 'last name must have value!').notEmpty();
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Signing Up",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) { //------if profile image is not exist----------------// 
            Driver.update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                phone_number: req.body.phone_number,
                password: bcrypt.hashSync(req.body.password, 8),

            },
                {
                    where: { id: req.body.id },
                    returning: true,
                    plain: true
                },
            ).then(user => {

                if (user) {
                    var token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });

                    return res.status(200).send({
                        status: 200,
                        message: "UPDATED is successful",
                        successData: {
                            user: {
                                id: user[1].id,
                                first_name: user[1].first_name,
                                last_name: user[1].last_name,
                                email: user[1].email,
                                phone_number: user[1].phone_number,
                                accessToken: token
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
}


//-------------Driver create vehicle register--------------------
exports.create_vehicle_reg = (req, res) => {

    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    req.checkBody('vehicle_type', 'vehicle_type must have value!').notEmpty();
    req.checkBody('brand', 'brand must have value!').notEmpty();
    req.checkBody('model', 'model must have value!').notEmpty();
    req.checkBody('number_plate', 'number_plate must have value!').notEmpty();
    req.checkBody('color', 'color must have value!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in vehicle register",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {
            req.checkBody('vehicle_document', 'vehicle document picture must have needed!').notEmpty();
            req.checkBody('frint_image', 'frint image must have needed!').notEmpty();
            req.checkBody('back_image', 'back image License picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('vehicle_document', 'vehicle_document picture must have needed animage').isImage(req.files.vehicle_document.name);
            req.checkBody('frint_image', 'frint_image  must have needed animage').isImage(req.files.frint_image.name);
            req.checkBody('back_image', 'back image  must have needed animage').isImage(req.files.back_image.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = 'E:/Techreneur/Go-Daala-BackEnd/public/files/uploadsFiles/driver/';
                //-----------------move vehicle document into server-------------------------------//
                req.files.vehicle_document.mv(path_file + '' + req.files.vehicle_document.name, function (err) {
                    if (err) console.log("error occured");
                });
                //-----------------move frint_image into server-------------------------------//
                req.files.frint_image.mv(path_file + '' + req.files.frint_image.name, function (err) {
                    if (err) console.log("error occured");
                });
                //-----------------move back_image into server-------------------------------//
                req.files.back_image.mv(path_file + '' + req.files.back_image.name, function (err) {
                    if (err) console.log("error occured");
                });
                // Save vendor to Database
                Vehicle_reg.create({
                    driver_id: req.body.driver_id,
                    vehicle_type: req.body.vehicle_type,
                    vehicle_document: '/public/files/uploadsFiles/vendor/' + req.files.vehicle_document.name,
                    brand: req.body.brand,
                    model: req.body.model,
                    number_plate: req.body.number_plate,
                    color: req.body.color,
                    frint_image: '/public/files/uploadsFiles/vendor/' + req.files.frint_image.name,
                    back_image: '/public/files/uploadsFiles/vendor/' + req.files.back_image.name,
                    status: "deactive",


                }).then(vehicle_reg => {

                    return res.status(200).send({
                        status: 200,
                        message: "Driver create Vehicle register is successful",
                        successData: {
                            vehicle: {
                                id: vehicle_reg.id,
                                vehicle_document: vehicle_reg.vehicle_document,
                                brand: vehicle_reg.brand,
                                model: vehicle_reg.model,
                                number_plate: vehicle_reg.number_plate,
                                color: vehicle_reg.color,
                                frint_image: vehicle_reg.frint_image,
                                back_image: vehicle_reg.back_image,
                                status: vehicle_reg.status,
                                driver_id: vehicle_reg.driver_id
                            }
                        }
                    });

                })
                    .catch(err => {

                        return res.status(200).send({
                            status: 400,
                            message: err.message,
                            successData: {}
                        });

                    });
            }
        }
    }
};

//-------------Driver create vehicle register--------------------
exports.get_all_vehicles = (req, res) => {

    Vehicle.findAll().then(all_vehicle => {
        if (!all_vehicle) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode is exist",
            });
        } else {
            return res.status(200).send({
                status: 200,
                message: "list of all vehicles",
                successData: {
                    vehicle_type: {
                        id: all_vehicle[0].dataValues.id,
                        vehicle_type: all_vehicle[0].dataValues.vehicle_type,
                        image_path: all_vehicle[0].dataValues.image_path

                    }
                }
            });
        }



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}



//--------------vendor create trip---------------
exports.create_trip = (req, res) => {
    req.checkBody('pickup', 'pickup must have value!').notEmpty();
    req.checkBody('dropoff', 'dropoff must have value!').notEmpty();
    req.checkBody('pickup_latitude', 'pickup_latitude must have value!').notEmpty();
    req.checkBody('pick_longitude', 'pick_longitude must have value!').notEmpty();
    req.checkBody('vehicle_name', 'vehicle_name must have value!').notEmpty();
    req.checkBody('estimated_distance', 'estimated_distance must have value!').notEmpty();
    req.checkBody('estimated_time', 'estimated_time must have value!').notEmpty();
    req.checkBody('total_cost', 'total_cost must have value!').notEmpty();
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
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
        // Save vendor to Database
        Trip.create({
            pickup: req.body.pickup,
            dropoff: req.body.dropoff,
            pickup_latitude: req.body.pickup_latitude,
            pick_longitude: req.body.pick_longitude,
            vehicle_name: req.body.vehicle_name,
            estimated_distance: req.body.estimated_distance,
            estimated_time: req.body.estimated_time,
            total_cost: req.body.total_cost,
            driver_id: req.body.driver_id,
            vendor_id: req.body.vendor_id

        }).then(trip => {

            return res.status(200).send({
                status: 200,
                message: "Create Trip  is successful",
                successData: {
                    trip: {
                        id: trip.id,
                        pickup: trip.pickup,
                        dropoff: trip.dropoff,
                        pickup_latitude: trip.pickup_latitude,
                        pick_longitude: trip.pick_longitude,
                        vehicle_name: trip.vehicle_name,
                        estimated_distance: trip.estimated_distance,
                        estimated_time: trip.estimated_time,
                        total_cost: trip.total_cost,
                        driver_id: trip.driver_id,
                        vendor_id: trip.vendor_id

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
        Trip.findOne({
            where: {
                driver_id: req.body.driver_id
            }
        }).then(trip => {
            return res.status(200).send({
                status: 200,
                message: "Get driver recent  Trip",
                successData: {
                    trip: {
                        id: trip.id,
                        pickup: trip.pickup,
                        dropoff: trip.dropoff,
                        pickup_latitude: trip.pickup_latitude,
                        pick_longitude: trip.pick_longitude,
                        vehicle_name: trip.vehicle_name,
                        estimated_distance: trip.estimated_distance,
                        estimated_time: trip.estimated_time,
                        total_cost: trip.total_cost,
                        driver_id: trip.driver_id,
                        vendor_id: trip.vendor_id

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

// //--------------vendor create address---------------
// exports.create_address = (req, res) => {
//     // Save vendor to Database
//     Address.create({
//         label: req.body.label,
//         address: req.body.address,
//         latitude: req.body.latitude,
//         longitude: req.body.longitude

//     }).then(address => {
//         console.log(address);
//         return res.status(200).send({
//             status: 200,
//             message: "Address Create is successful",
//             successData: {
//                 address: {
//                     id: address.id,
//                     address: address.address,
//                     latitude: address.latitude,
//                     longitude: address.longitude

//                 }
//             }
//         });

//     }).catch(err => {

//         return res.status(200).send({
//             status: 400,
//             message: err.message,
//             successData: {}
//         });

//     });

// }

// //--------------vendor update address------------
// exports.update_address = (req, res) => {
//     Address.update({
//         label: req.body.label,
//         address: req.body.address,
//         latitude: req.body.latitude,
//         longitude: req.body.longitude
//     },
//         {
//             where: { id: req.body.id },
//             returning: true,
//             plain: true
//         },
//     ).then(address => {

//         if (address) {

//             return res.status(200).send({
//                 status: 200,
//                 message: "Address updated is successful",
//                 successData: {
//                     address: {
//                         id: address[1].id,
//                         label: address[1].label,
//                         address: address[1].address,
//                         latitude: address[1].latitude,
//                         longitude: address[1].longitude
//                     }
//                 }
//             });
//         }
//     }).catch(err => {
//         return res.status(200).send({
//             status: 400,
//             message: err.message,
//             successData: {}
//         });


//     });
// }

// //--------------vendor delete address------------
// exports.delete_address = (req, res) => {
//     Address.destroy({
//         where: {
//             id: req.body.id
//         }
//     }).then(address => {

//         if (!address) {
//             return res.status(200).send({
//                 status: 400,
//                 message: "Contacts not found",
//                 successData: {}
//             });
//         }

//         return res.status(200).send({
//             status: 200,
//             message: "Vendor Address is successful Deleted",
//             successData: {}
//         });

//     }).catch(err => {
//         return res.status(200).send({
//             status: 400,
//             message: err.message,
//             successData: {}
//         });
//     });
// }




// //--------------vendor create trip---------------
// exports.create_trip = (req, res) => {
//     // Save vendor to Database
//     Trip.create({
//         pickup: req.body.pickup,
//         dropoff: req.body.dropoff,
//         pickup_latitude: req.body.pickup_latitude,
//         pick_longitude: req.body.pick_longitude,
//         vehicle_name: req.body.vehicle_name,
//         estimated_distance: req.body.estimated_distance,
//         estimated_time: req.body.estimated_time,
//         total_cost: req.body.total_cost

//     }).then(trip => {

//         return res.status(200).send({
//             status: 200,
//             message: "Trip  Create is successful",
//             successData: {
//                 address: {
//                     id: trip.id,
//                     pickup: trip.pickup,
//                     dropoff: trip.dropoff,
//                     pickup_latitude: trip.pickup_latitude,
//                     pick_longitude: trip.pick_longitude,
//                     vehicle_name: trip.vehicle_name,
//                     estimated_distance: trip.estimated_distance,
//                     estimated_time: trip.estimated_time,
//                     total_cost: trip.total_cost

//                 }
//             }
//         });

//     }).catch(err => {

//         return res.status(200).send({
//             status: 400,
//             message: err.message,
//             successData: {}
//         });

//     });

// }


// //---------------vendor validate promo code -----------------
// exports.validate_promo_code = (req, res) => {
//     Promo.findOne({
//         where: {
//             code: req.body.code
//         }
//     }).then(promo => {
//         //if User not found with given ID
//         if (promo) {
//             if (promo.dataValues.publish == "on") {
//                 return res.status(200).send({
//                     status: 200,
//                     message: "Promo code is valid",
//                     successData: {
//                         promo: {
//                             id: promo.id,
//                             code: promo.code,
//                             type: promo.type,
//                             discount: promo.discount,
//                             publish: promo.publish
//                         }
//                     }
//                 });
//             }
//         } else {

//             return res.status(200).send({
//                 status: 400,
//                 message: "promo code is invalid",
//                 successData: {

//                 }
//             });
//         }
//     });
// }






