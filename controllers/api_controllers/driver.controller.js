const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Driver = db.driver;
const Vehicle_reg = db.vehicle_reg;
const Vehicle = db.vehicle;
const Contect_us = db.contect_us;
const Trip = db.trip;
const Promo = db.promo;
const Faqs = db.faqs;
const Dirver_lat_long = db.driver_lat_long;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require('fs');
var path = require('path');
var OTP = db.otp;
const axios = require('axios');



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

                var path_file = './public/files/uploadsFiles/driver/';
                var fileOne = 'profile-1' + Date.now() + req.files.profile.name;
                //-----------------move profile into server-------------------------------//
                req.files.profile.mv(path_file + '' + fileOne, function (err) {
                    if (err) console.log("error occured");
                });



                // var profilename = 'profile-1' + Date.now() + path.extname(req.files.profile.name);
                // fs.rename(path_file + '' + req.files.profile.name, path_file + '' + profilename, function (err) {
                //     if (err) console.log('file not renameing');
                // });



                //-----------------move cnic into server-------------------------------//

                var cnicfilename = 'profile-2' + Date.now() + req.files.cnic.name;
                req.files.cnic.mv(path_file + cnicfilename, function (err) {
                    if (err) console.log("error occured");
                });





                //-----------------move driving_license into server-------------------------------//
                var drivefilename = 'profile-3' + Date.now() + req.files.driving_license.name;
                req.files.driving_license.mv(path_file + drivefilename, function (err) {
                    if (err) console.log("error occured");
                });



                // Save vendor to Database
                Driver.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: bcrypt.hashSync(req.body.password, 8),
                    profile: '/public/files/uploadsFiles/driver/' + fileOne,
                    cnic: '/public/files/uploadsFiles/driver/' + cnicfilename,
                    driving_license: '/public/files/uploadsFiles/driver/' + drivefilename,
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

                Driver.update({
                    status: 'active'
                },
                    {
                        where: { id: user.id },

                    },
                ).then(update => {

                }).catch(err => {
                    return res.status(200).send({
                        status: 400,
                        message: err.message,
                        successData: {}
                    });
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
                            status: 'active',
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

                var path_file = './public/files/uploadsFiles/driver/';


                //-----------------move vehicle document into server-------------------------------//
                var docfilename = 'profile-1' + Date.now() + req.files.vehicle_document.name;
                req.files.vehicle_document.mv(path_file + '' + docfilename, function (err) {
                    if (err) console.log("error occured");
                });

                //-----------------move frint_image into server-------------------------------//
                var frintfilename = 'profile-2' + Date.now() + req.files.frint_image.name;
                req.files.frint_image.mv(path_file + '' + frintfilename, function (err) {
                    if (err) console.log("error occured");
                });



                //-----------------move back_image into server-------------------------------//
                var backfilename = 'profile-3' + Date.now() + req.files.back_image.name;
                req.files.back_image.mv(path_file + '' + backfilename, function (err) {
                    if (err) console.log("error occured");
                });



                // Save vendor to Database
                Vehicle_reg.create({
                    driver_id: req.body.driver_id,
                    vehicle_type: req.body.vehicle_type,
                    vehicle_document: '/public/files/uploadsFiles/driver/' + docfilename,
                    brand: req.body.brand,
                    model: req.body.model,
                    number_plate: req.body.number_plate,
                    color: req.body.color,
                    frint_image: '/public/files/uploadsFiles/driver/' + frintfilename,
                    back_image: '/public/files/uploadsFiles/driver/' + backfilename,
                    status: "deactive",


                }).then(vehicle_reg => {

                    return res.status(200).send({
                        status: 200,
                        message: "Driver create Vehicle register is successful",
                        successData: {
                            vehicle: {
                                id: vehicle_reg.id,
                                vehicle_type: vehicle_reg.vehicle_type,
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
                    vehicle_type_list: {
                        vehicle_list: all_vehicle

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

exports.get_all_faqs = (req, res) => {
    Faqs.findAll().then(all_faqs => {
        if (!all_faqs) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode is exist",
                successData: {
                }
            });
        } else {
            return res.status(200).send({
                status: 200,
                message: "list of all FAQ's' ",
                successData: {
                    all_faqs_list: {
                        all_faqs: all_faqs

                    }
                }
            });
        }



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
            successData: {

            }
        });
    });
}


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
        Trip.update({
            driver_id: req.body.driver_id,
            status: "wait",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

                return res.status(200).send({
                    status: 200,
                    message: "Driver receive trip  is successful",
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
            driver_id: null,
            status: "cencal",

        },
            {
                where: { id: req.body.trip_id },
                returning: true,
                plain: true
            }).then(trip => {

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


//--------------driver contact us ----------------------
exports.contact_us = function (req, res, next) {
    req.checkBody('first_name', 'First Name must have value!').notEmpty();
    req.checkBody('last_name', 'Last Name must have value!').notEmpty();
    req.checkBody('email', 'Email must have value!').notEmpty();
    req.checkBody('phone', 'Phone Number must have value!').notEmpty();
    req.checkBody('message', 'Message must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        return res.status(200).send({
            status: 400,
            message: "validation error in contect us",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Contect_us.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message


        }).then(contect => {
            if (contect) {
                return res.status(200).send({
                    status: 200,
                    message: "Contect is successfuly send",
                    successData: {
                        contect_us: {
                            first_name: contect.first_name,
                            last_name: contect.last_name,
                            email: contect.email,
                            phone: contect.phone,
                            message: contect.message
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
};

//--------------driver current location ----------------------
exports.current_location = (req, res) => {
    req.checkBody('latitude', 'latitude must have needed!').notEmpty();
    req.checkBody('longitude', 'longitude must have needed!').notEmpty();
    req.checkBody('driver_id', 'driver_id must have required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in  driver current  location",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Dirver_lat_long.create({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            driver_id: req.body.driver_id


        }).then(driver_lat => {
            if (driver_lat) {
                return res.status(200).send({
                    status: 200,
                    message: "Driver current location is successfuly submeitted",
                    successData: {
                        driver_lat_long: {
                            latitude: driver_lat.latitude,
                            longitude: driver_lat.longitude,
                            driver_id: driver_lat.driver_id
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

//--------------driver forgot password  ----------------------
exports.forgot_password = (req, res) => {
    req.checkBody('new_password', 'new_password must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();



    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in forgot password",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Driver.update({
            password: bcrypt.hashSync(req.body.new_password, 8)

        },
            {
                where: { phone_number: req.body.phone_number },
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
                    message: "Password UPDATED is successful",
                    successData: {
                        user: {
                            id: user[1].id,
                            first_name: user[1].first_name,
                            last_name: user[1].last_name,
                            email: user[1].email,
                            phone_number: user[1].phone_number,
                            profile: user[1].profile,
                            cnic: user[1].cnic,
                            driving_license: user[1].driving_license,
                            account_info: user[1].account_info,
                            accessToken: token
                        }
                    }
                });
            } else {
                return res.status(200).send({
                    status: 400,
                    message: "this phone number is exist! please do this again with currect information",
                    successData: {}
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

//--------------driver update picture  ----------------------
exports.update_picture = (req, res) => {
    req.checkBody('id', 'id must have ID!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in update picture",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {  ////////--------------------new profile is not uploaded----------------/////////
            req.checkBody('new_profile', 'new_profile must have uploaded!').notEmpty();
            return res.status(200).send({
                status: 400,
                message: "validation error in update picture",
                successData: {
                    error: {
                        error: errors
                    }
                }
            });
        } else {

            req.checkBody('new_profile', 'new_profile picture must have uploaded animage').isImage(req.files.new_profile.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in update picture",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = './public/files/uploadsFiles/driver/';

                //-----------------move profile into server-------------------------------//
                var filename = 'profile-' + Date.now() + req.files.new_profile.name;
                req.files.new_profile.mv(path_file + '' + filename, function (err) {
                    if (err) console.log("error occured");
                });




                fs.unlink('.' + req.body.file, function (err) {
                    if (err) {
                        console.log("err occer file not deleted");
                    } else {
                        console.log("file  deleted");
                    }
                })
                Driver.update({
                    profile: '/public/files/uploadsFiles/driver/' + filename
                },
                    {
                        where: { id: req.body.id },
                        returning: true,
                        plain: true
                    },
                ).then(user => {

                    if (user) {

                        return res.status(200).send({
                            status: 200,
                            message: "Profile picture is  UPDATED is successful",
                            successData: {
                                user: {
                                    id: user[1].id,
                                    first_name: user[1].first_name,
                                    last_name: user[1].last_name,
                                    email: user[1].email,
                                    phone_number: user[1].phone_number,
                                    profile: user[1].profile,
                                    cnic: user[1].cnic,
                                    driving_license: user[1].driving_license,
                                    status: user[1].status,
                                    account_info: user[1].account_info
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
}

exports.contect_us = function (req, res, next) {
    req.checkBody('first_name', 'First Name must have value!').notEmpty();
    req.checkBody('last_name', 'Last Name must have value!').notEmpty();
    req.checkBody('email', 'Email must have value!').notEmpty();
    req.checkBody('phone', 'Phone Number must have value!').notEmpty();
    req.checkBody('message', 'Message must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        return res.status(200).send({
            status: 400,
            message: "validation error in contect us",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Contect_us.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            driver_id: req.body.driver_id


        }).then(contect => {
            if (contect) {
                return res.status(200).send({
                    status: 200,
                    message: "Contect is successfuly send",
                    successData: {
                        contect_us: {
                            first_name: contect.first_name,
                            last_name: contect.last_name,
                            email: contect.email,
                            phone: contect.phone,
                            message: contect.message,
                            driver_id: contect.driver_id
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
};

exports.get_reply = function (req, res) {
    Contect_us.findAll({
        where: {
            driver_id: req.body.driver_id,
            admin_id: "1"
        }
    }).then(all_driver_record => {
        if (all_driver_record) {
            return res.status(200).send({
                status: 200,
                message: "Driver reply is successfuly received",
                successData: {
                    all_reply_driver_record: {
                        all_driver_record: all_driver_record
                    }
                }
            });

        } else {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode is exist in db",
            });
        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}

//SendOTP
exports.sendOTP = (req, res) => {
    req.checkBody('phone_number', 'Phone Number must have value!').notEmpty();

    console.log(req.body.phone_number);
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in OTP sending!",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    }
     else {


        //Check User Already Exist or Not?
        Driver.findOne({
            where: {
                phone_number: req.body.phone_number
            }
        })
            .then(user => {
     
                if (!user) {
                    //User is not Exist
                    var val = Math.floor(1000 + Math.random() * 9000);
                    var messageData = "Your Go Daala Verification Code is: " + val;
                    var mobileno = req.body.phone_number;

                    // axios.get('http://smsctp1.eocean.us:24555/api?action=sendmessage&username=mkhata_99095&password=pak@456&recipient='+mobileno+'&originator=99095&messagedata='+messageData)
                        
                    axios.get('http://api.veevotech.com/sendsms?hash=3defxp3deawsbnnnzu27k4jbcm26nzhb9mzt8tq7&receivenum='+mobileno+'&sendernum=8583&textmessage='+messageData)
                    .then(response => {


                            OTP.create({
                                otp: val,
                                phone_number: mobileno
                            }).then(otp => {

                                return res.status(200).send({
                                    responsecode: 200,
                                    message: "OTP send successfully"
                                });

                            }).catch(error => {
                                console.log(error);
                            });


                        })
                        .catch(error => {
                            console.log(error);
                        });

                } else {

                    return res.status(200).send({
                        responsecode: 400,
                        message: "User Already Exist",
                    });


                }




            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });

    }
    // else if (req.body.type.toLowerCase() == "login") {

    //   //Check User Already Exist or Not?
    //   User.findOne({
    //     where: {
    //       phone: req.body.user_phone
    //     }
    //   })
    //     .then(user => {

    //       if (!user) {
    //         //User is not Exist
    //         return res.status(200).send({
    //           responsecode: 400,
    //           message: "User is Not Exist",
    //         });
    //       } else {


    //         var val = Math.floor(1000 + Math.random() * 9000);
    //         var messageData = "Your mKhata Verification Code is: " + val;
    //         var mobileno = req.body.user_phone;

    //         axios.get(`http://smsctp1.eocean.us:24555/api?action=sendmessage&username=mkhata_99095&password=pak@456&recipient=${mobileno}&originator=99095&messagedata=${messageData}`)
    //         .then(response => {


    //             OTP.create({
    //               otp: val,
    //               phone: req.body.user_phone
    //             }).then(otp => {

    //               return res.status(200).send({
    //                 responsecode: 200,
    //                 message: "OTP send successfully"
    //               });

    //             }).catch(error => {
    //               console.log(error);
    //             });


    //           })
    //           .catch(error => {
    //             console.log(error);
    //           });


    //       }




    //     })
    //     .catch(err => {
    //       res.status(500).send({ message: err.message });
    //     });
    // }else if (req.body.type.toLowerCase() == "password") {

    //   //Check User Already Exist or Not?
    //   User.findOne({
    //     where: {
    //       phone: req.body.user_phone
    //     }
    //   })
    //     .then(user => {

    //       if (!user) {
    //         //User is not Exist
    //         return res.status(200).send({
    //           responsecode: 400,
    //           message: "User is Not Exist",
    //         });
    //       } else {


    //         var val = Math.floor(1000 + Math.random() * 9000);
    //         var messageData = "Your mKhata Verification Code is: " + val;
    //         var mobileno = req.body.user_phone;

    //         axios.get(`http://smsctp1.eocean.us:24555/api?action=sendmessage&username=mkhata_99095&password=pak@456&recipient=${mobileno}&originator=99095&messagedata=${messageData}`)
    //         .then(response => {


    //             OTP.create({
    //               otp: val,
    //               phone: req.body.user_phone
    //             }).then(otp => {

    //               return res.status(200).send({
    //                 responsecode: 200,
    //                 message: "OTP send successfully"
    //               });

    //             }).catch(error => {
    //               console.log(error);
    //             });


    //           })
    //           .catch(error => {
    //             console.log(error);
    //           });


    //       }




    //     })
    //     .catch(err => {
    //       res.status(500).send({ message: err.message });
    //     });
    // }else{

    //   var val = Math.floor(1000 + Math.random() * 9000);
    //   var messageData = "Your mKhata Verification Code is: " + val;
    //   var mobileno = req.body.user_phone;

    //   axios.get(`https://pk.eocean.us/APIManagement/API/RequestAPI?user=mkhata&pwd=AHd5JmJP6h9s40dgcFKLsdRwfmTnQJhyvd3KkUQcNvhAwOpQ%2bAHL4Rcz1sBpEbQn0Q%3d%3d&sender=MKhata&reciever=${mobileno}&msg-data=${messageData}&response=string`)
    //     .then(response => {


    //       OTP.create({
    //         otp: val,
    //         phone: req.body.user_phone
    //       }).then(otp => {

    //         return res.status(200).send({
    //           responsecode: 200,
    //           message: "OTP send successfully"
    //         });

    //       }).catch(error => {
    //         console.log(error);
    //       });


    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
};

//Verify OTP
exports.varify_otp = (req, res) => {
    req.checkBody('phone_number', 'Phone Number must have value!').notEmpty();
    req.checkBody('otp', 'Phone Number must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in OTP sending!",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {

        //If User is exist then moving to Contact
        OTP.findOne({
            where: {
                otp: req.body.otp,
                phone_number: req.body.phone_number

            }
        }).then(otp => {


            if (!otp) {
                return res.status(200).send({
                    responsecode: 400,
                    message: "Invalid OTP",
                });
            }


            //Delete OTP after ine-time used
            OTP.destroy({
                where: {
                    otp: req.body.otp,
                    phone_number: req.body.phone_number
                }
            }).then(removedOTP => {

               
                    return res.status(200).send({
                        responsecode: 200,
                        message: "OTP Validation Success",
                    });
                

            }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });




        }).catch(err => {
            return res.status(200).send({
                responsecode: 400,
                message: err.message,
            });
        });
    }


}

