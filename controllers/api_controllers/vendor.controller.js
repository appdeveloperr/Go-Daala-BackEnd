const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Vendor = db.vendor;
const Address = db.address;
const Trip = db.trip;
const Promo = db.promo;
const Contect_us= db.contect_us;
const Faqs = db.faqs;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require('fs');
var path = require('path');


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

                var path_file = './public/files/uploadsFiles/vendor/';
                var filename = 'profile-1' + Date.now() + req.files.profile.name;
                req.files.profile.mv(path_file+''+filename, function (err) {
                    if (err) console.log("error occured");
                });

               

                // Save vendor to Database
                Vendor.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: bcrypt.hashSync(req.body.password, 8),
                    profile: '/public/files/uploadsFiles/vendor/' + filename,
                    account_info: 'unblock'
                    //  
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
        Vendor.findOne({
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


//--------------vendor profile update---------------
exports.update = (req, res) => {

    req.checkBody('first_name', 'first_name must have value!').notEmpty();
    req.checkBody('last_name', 'last name must have value!').notEmpty();
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in update Profile",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Vendor.update({
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
                            profile: user[1].profile,
                            account_info: user[1].account_info,
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




//--------------vendor create address---------------
exports.create_address = (req, res) => {
    req.checkBody('label', 'label must have value!').notEmpty();
    req.checkBody('address', 'address must have value!').notEmpty();
    req.checkBody('latitude', 'latitude must have value!').notEmpty();
    req.checkBody('longitude', 'longitude must have value!').notEmpty();



    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in create address",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save vendor to Database
        Address.create({
            label: req.body.label,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            vendor_id: req.body.vendor_id

        }).then(addresss => {
            return res.status(200).send({
                status: 200,
                message: "Address Create is successful",
                successData: {
                    address: {
                        id: addresss.id,
                        address: addresss.address,
                        latitude: addresss.latitude,
                        longitude: addresss.longitude,
                        vendor_id: addresss.vendor_id

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

//--------------vendor update address------------
exports.update_address = (req, res) => {
    req.checkBody('label', 'label must have value!').notEmpty();
    req.checkBody('address', 'address must have value!').notEmpty();
    req.checkBody('latitude', 'latitude must have value!').notEmpty();
    req.checkBody('longitude', 'longitude must have value!').notEmpty();



    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in update address",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Address.update({
            label: req.body.label,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,

        },
            {
                where: { id: req.body.id },
                returning: true,
                plain: true
            },
        ).then(address => {

            if (address) {

                return res.status(200).send({
                    status: 200,
                    message: "Address updated is successful",
                    successData: {
                        address: {
                            id: address[1].id,
                            label: address[1].label,
                            address: address[1].address,
                            latitude: address[1].latitude,
                            longitude: address[1].longitude,
                            vendor_id: address[1].vendor_id
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

//--------------vendor delete address------------
exports.delete_address = (req, res) => {
    Address.destroy({
        where: {
            id: req.body.id
        }
    }).then(address => {

        if (!address) {
            return res.status(200).send({
                status: 400,
                message: "Contacts not found",
                successData: {}
            });
        }

        return res.status(200).send({
            status: 200,
            message: "Vendor Address is successful Deleted",
            successData: {}
        });

    }).catch(err => {
        return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {}
        });
    });
}


exports.index_address=(req,res)=>{
    Address.findAll().then(all_address => {
        if (!all_address) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode exist",
                successData:{

                }
              });
        }
        return res.status(200).send({
            status: 200,
            message: "Get all vendor address",
            successData: {
                address: {
                    all_address:all_address
                }
            }
        });
     
     
    
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
            driver_id: null,
            vendor_id: req.body.vendor_id,
            status:null

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
                        vendor_id: trip.vendor_id,
                        status:trip.status

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
        Trip.findOne({
            where: {
                vendor_id: req.body.vendor_id
            }
        }).then(trip => {
            return res.status(200).send({
                status: 200,
                message: "Get vendor recent  Trip",
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


//---------------vendor validate promo code -----------------
exports.validate_promo_code = (req, res) => {
    req.checkBody('code', 'promo code must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in promo code",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Promo.findOne({
            where: {
                code: req.body.code
            }
        }).then(promo => {
            //if User not found with given ID
            if (promo) {
                if (promo.dataValues.publish == "on") {
                    return res.status(200).send({
                        status: 200,
                        message: "Promo code is valid",
                        successData: {
                            promo: {
                                id: promo.id,
                                code: promo.code,
                                type: promo.type,
                                discount: promo.discount,
                                publish: promo.publish
                            }
                        }
                    });
                }
            } else {

                return res.status(200).send({
                    status: 400,
                    message: "promo code is invalid",
                    successData: {

                    }
                });
            }
        });
    }
}


exports.forgot_password = function (req, res) {
    req.checkBody('new_password', 'new passwod must have value!').notEmpty();
    req.checkBody('phone_number', 'phone_number must have value!').notEmpty();
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

        Vendor.update({
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
                            account_info: user[1].account_info,
                            accessToken: token
                        }
                    }
                });
            }else{
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


////// ----------------------update profile picture-----------------------/////////////
exports.update_picture = function (req, res) {
    req.checkBody('id', 'id must have ID!').notEmpty();
    req.checkBody('file', 'old file must have oldpath needed!');
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



                var path_file = './public/files/uploadsFiles/vendor/';

                var file = req.files.new_profile;




                //-----------------move profile into server-------------------------------//
                var filename = 'profile-1' + Date.now() + req.files.new_profile.name;
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
                Vendor.update({
                    profile: '/public/files/uploadsFiles/vendor/' + filename
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


exports.get_all_faqs=(req,res)=>{
    Faqs.findAll().then(all_faqs => {
        if (!all_faqs) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode is exist",
                successData:{
                }
            });
        } else {
            return res.status(200).send({
                status: 200,
                message: "list of all FAQ's' ",
                successData: {
                    all_faqs_list: {
                        all_faqs:all_faqs

                    }
                }
            });
        }



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
            successData:{

            }
        });
    });
}



