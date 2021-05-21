const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver = db.driver;
const Vehicla_reg = db.vehicle_reg;
const Vehicle = db.vehicle;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require('fs');
var path = require('path');
const axios = require('axios');
var OTP = db.otp;

//-------------driver signup--------------------
exports.signup = (req, res) => {
    console.log(req);







                // Save vendor to Database
                var fileOne = "";
                var cnicfilename = "";
                var drivefilename = "";

                Driver.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: bcrypt.hashSync(req.body.password, 8),
                    profile: '/files/uploadsFiles/driver/' + fileOne,
                    cnic: '/files/uploadsFiles/driver/' + cnicfilename,
                    driving_license: '/files/uploadsFiles/driver/' + drivefilename,
                    status: "active",
                    account_info: "block",
                    fcm_token: req.body.fcm_token,
                    total_rating: "0",
                    total_review: "0"
                }).then(user => {

                    var token = jwt.sign({ id: user.id }, config.secret, {


                    });

                    delete user.dataValues.password;
                    user.dataValues.accessToken = token;
                    return res.status(200).send({
                        status: 200,
                        message: "Signing Up is successful",
                        successData: {
                            user: user,


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

    // req.checkBody('first_name', 'first_name must have value!').notEmpty();
    // req.checkBody('last_name', 'last name must have value!').notEmpty();
    // req.checkBody('email', 'email must have value!').notEmpty();
    // req.checkBody('phone_number', 'phone number must have value!').notEmpty();
    // req.checkBody('password', 'password must have value!').notEmpty();
    // req.checkBody('fcm_token', 'Please provide a fcm token needed!').notEmpty();

    // var errors = req.validationErrors();
    // if (errors) {                    //////////------input text validation error
    //     console.log("DRIVER ERROR 0");

    //     return res.status(200).send({
    //         status: 400,
    //         message: "validation error in Signing Up",
    //         successData: {
    //             error: {
    //                 error: errors
    //             }
    //         }
    //     });
    // } else {
    //     if (!req.files) {

    //         req.checkBody('profile', 'profile picture must have needed!').notEmpty();
    //         req.checkBody('cnic', 'CNIC picture must have needed!').notEmpty();
    //         req.checkBody('driving_license', 'Driving License picture must have needed!').notEmpty();
    //         var errors = req.validationErrors();
    //         if (errors) {                 //////////------input file validation error
    //             console.log("DRIVER ERROR 1");

    //             return res.status(200).send({
    //                 status: 400,
    //                 message: "validation error in Signing Up",
    //                 successData: {
    //                     error: {
    //                         error: errors
    //                     }
    //                 }
    //             });
    //         }
    //     } else {
            
    //         console.log(req);
    //         req.checkBody('profile', 'profile picture must have needed animage').isImage(req.files.profile.name);
    //         req.checkBody('cnic', 'cnic picture must have needed animage').isImage(req.files.cnic.name);
    //         req.checkBody('driving_license', 'driving_license picture must have needed animage').isImage(req.files.driving_license.name);
    //         var errors = req.validationErrors();
    //         if (errors) {   //////////------input file must have image validation error
    //             console.log("DRIVER ERROR 2");

    //             return res.status(200).send({
    //                 status: 400,
    //                 message: "validation error in Signing Up",
    //                 successData: {
    //                     error: {
    //                         error: errors
    //                     }
    //                 }
    //             });
    //         } else {   ///------------------ no error exist

    //             var path_file = './public/files/uploadsFiles/driver/';
    //             var fileOne = 'profile-1' + Date.now() + req.files.profile.name;
    //             //-----------------move profile into server-------------------------------//
    //             req.files.profile.mv(path_file + '' + fileOne, function (err) {
    //                 if (err) console.log("error occured");
    //             });



    //             //-----------------move cnic into server-------------------------------//

    //             var cnicfilename = 'profile-2' + Date.now() + req.files.cnic.name;
    //             req.files.cnic.mv(path_file + cnicfilename, function (err) {
    //                 if (err) console.log("error occured");
    //             });





    //             //-----------------move driving_license into server-------------------------------//
    //             var drivefilename = 'profile-3' + Date.now() + req.files.driving_license.name;
    //             req.files.driving_license.mv(path_file + drivefilename, function (err) {
    //                 if (err) console.log("error occured");
    //             });



    //             // Save vendor to Database
    //             Driver.create({
    //                 first_name: req.body.first_name,
    //                 last_name: req.body.last_name,
    //                 email: req.body.email,
    //                 phone_number: req.body.phone_number,
    //                 password: bcrypt.hashSync(req.body.password, 8),
    //                 profile: '/files/uploadsFiles/driver/' + fileOne,
    //                 cnic: '/files/uploadsFiles/driver/' + cnicfilename,
    //                 driving_license: '/files/uploadsFiles/driver/' + drivefilename,
    //                 status: "active",
    //                 account_info: "block",
    //                 fcm_token: req.body.fcm_token,
    //                 total_rating: "0",
    //                 total_review: "0"
    //             }).then(user => {

    //                 var token = jwt.sign({ id: user.id }, config.secret, {


    //                 });

    //                 delete user.dataValues.password;
    //                 user.dataValues.accessToken = token;
    //                 return res.status(200).send({
    //                     status: 200,
    //                     message: "Signing Up is successful",
    //                     successData: {
    //                         user: user,


    //                     }
    //                 });

    //             })
    //                 .catch(err => {

    //                     return res.status(200).send({
    //                         status: 400,
    //                         message: err.message,
    //                         successData: {}
    //                     });

    //                 });
    //         }
    //     }

    // }



};
//-------------driver varify_ email--------------------
exports.varify_email = (req, res) => {
    req.checkBody('email', 'email must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in varify email",
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
                        message: "User email  is not found.",
                        successData: {}
                    });
                } else {
                    return res.status(200).send({
                        status: 200,
                        message: "User email  already exist.",
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


//-------------driver varify phone number--------------------
exports.varify_phone_number = (req, res) => {
    req.checkBody('phone_number', 'Phone number must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in varify phone number",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Driver.findOne({
            where: {
                phone_number: req.body.phone_number
            }
        })
            .then(user => {

                if (!user) {
                    return res.status(200).send({
                        status: 200,
                        message: "User Phone number  is not found.",
                        successData: {}
                    });
                } else {
                    return res.status(200).send({
                        status: 400,
                        message: "User phone number is already exist.",
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


//--------------vendor signin-------------------
exports.signin = (req, res) => {
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();
    req.checkBody('fcm_token', 'Please provide fcm token value needed!')

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
                    return res.status(200).send({
                        status: 400,
                        accessToken: null,
                        message: "Invalid user Password!",
                        successData: {}

                    });
                }


                if (user.dataValues.account_info == 'block') {
                    return res.status(200).send({
                        status: 400,
                        message: "please wait for admin approvel.",
                        successData: {}
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {


                });

                Driver.update({
                    status: 'active',
                    fcm_token: req.body.fcm_token
                },
                    {
                        where: { id: user.id },
                        returning: true,
                        plain: true
                     
                    },  
                ).then(user => {

                    delete user[1].dataValues.password;
                    user[1].dataValues.accessToken = token;

                    Vehicla_reg.findOne({
                        where: {
                            driver_id: user[1].dataValues.id
                        }

                    }).then(vehicle_info => {
                        Vehicle.findOne({
                            where: {
                                vehicle_type: vehicle_info.dataValues.vehicle_type
                            }
                        }).then(vehicle_charges => {
                            vehicle_info.dataValues.service = vehicle_charges.dataValues.service;
                            vehicle_info.dataValues.distance = vehicle_charges.dataValues.distance;
                            vehicle_info.dataValues.time = vehicle_charges.dataValues.time;
                            console.log(vehicle_info);
                            return res.status(200).send({
                                status: 200,
                                message: "Login Successfull.",
                                successData: {
                                    user: user[1],
                                    vehicle: vehicle_info
                                }

                            });
                        }).catch(err => {
                            return res.status(200).send({
                                status: 400,
                                message: "error from get vehicle information " + err.message,
                                successData: {}
                            });
                        });

                    }).catch(err => {
                        return res.status(200).send({
                            status: 400,
                            message: "error from get vehicle information " + err.message,
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

                if (user != null || user != '') {
                    var token = jwt.sign({ id: user.id }, config.secret, {


                    });
                    delete user[1].dataValues.password;
                    user[1].dataValues.accessToken = token;
                    return res.status(200).send({
                        status: 200,
                        message: "UPDATED is successful",
                        successData: {
                            user: user[1].dataValues
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

            if (user != null || user != '') {
                var token = jwt.sign({ id: user.id }, config.secret);
                user[1].dataValues.accessToken = token;
                delete user[1].dataValues.password;
                Vehicla_reg.findOne({
                    where: {
                        driver_id: user[1].dataValues.id
                    }
                }).then(vehicle_info => {
                    Vehicle.findOne({
                        where: {
                            vehicle_type: vehicle_info.dataValues.vehicle_type
                        }
                    }).then(vehicle_charges => {
                        vehicle_info.dataValues.service = vehicle_charges.dataValues.service;
                        vehicle_info.dataValues.distance = vehicle_charges.dataValues.distance;
                        vehicle_info.dataValues.time = vehicle_charges.dataValues.time;
                

                        return res.status(200).send({
                            status: 200,
                            message: "Password UPDATED is successful",
                            successData: {
                                user: user[1].dataValues,
                                vehicle:vehicle_info
                            }
                        });
                    }).catch(err => {
                        return res.status(200).send({
                            status: 400,
                            message: "error from get vehicle information " + err.message,
                            successData: {}
                        });
                    });

                }).catch(err => {
                    return res.status(200).send({
                        status: 400,
                        message: "error from get vehicle information " + err.message,
                        successData: {}
                    });
                });
            } else {
                return res.status(200).send({
                    status: 400,
                    message: "This phone number is exist! please do this again with currect information",
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




                fs.unlink('./public' + req.body.file, function (err) {
                    if (err) {
                        console.log("err occer file not deleted");
                    } else {
                        console.log("file  deleted");
                    }
                })
                Driver.update({
                    profile: '/files/uploadsFiles/driver/' + filename
                },
                    {
                        where: { id: req.body.id },
                        returning: true,
                        plain: true
                    },
                ).then(user => {
                    console.log("this is tracker no 2");
                    var token = jwt.sign({ id: user.id }, config.secret);
                    user[1].dataValues.accessToken = token;
                    delete user[1].dataValues.password;
                    return res.status(200).send({
                        status: 200,
                        message: "Profile picture is  UPDATED is successful",
                        successData: {
                            user: user[1]
                        }
                    });

                }).catch(err => {
                    console.log("this is tracker no 3");
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

//--------------driver active status updated   ----------------------
exports.active_status = (req, res) => {
    req.checkBody('driver_id', 'id must have ID!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in active status",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Driver.update({
            status: 'active'
        },
            {
                where: {
                    id: req.body.driver_id
                },
                returning: true,
                plain: true
            },
        ).then(user => {
            var token = jwt.sign({ id: user.id }, config.secret);
            user[1].dataValues.accessToken = token;
            delete user[1].dataValues.password;
            return res.status(200).send({
                status: 200,
                message: "active Status updated is successful",
                successData: {
                    user: user[1]
                }
            });
        }).catch(error => {
            return res.status(200).send({
                status: 400,
                message: "driver not found! ",
                successData: {}
            });
        });
    }
}

//--------------driver unactive status updated   ----------------------
exports.unactive_status = (req, res) => {
    req.checkBody('driver_id', 'id must have ID!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in unactive status",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Driver.update({
            status: 'unactive'
        },
            {
                where: {
                    id: req.body.driver_id
                },
                returning: true,
                plain: true
            },
        ).then(user => {
            var token = jwt.sign({ id: user.id }, config.secret, {});
            user[1].dataValues.accessToken = token;
            delete user[1].dataValues.password;
            return res.status(200).send({
                status: 200,
                message: "unactive Status updated is successful",
                successData: {
                    user: user[1]
                }
            });
        }).catch(error => {
            return res.status(200).send({
                status: 400,
                message: error
            });
        });
    }
}
//SendOTP
exports.sendOTP = (req, res) => {
    req.checkBody('phone_number', 'Phone Number must have value!').notEmpty();
    req.checkBody('type', 'Type must have needed value!').notEmpty();

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

        if (req.body.type == "forget") {
            //Check User Already Exist or Not?
            Driver.findOne({
                where: {
                    phone_number: req.body.phone_number
                }
            })
                .then(user => {

                    if (!user) {
                        //User is not Exist 
                        return res.status(200).send({
                            status: 400,
                            message: "This user Phone number is not found",
                            successData: {}
                        });

                    } else {  //User is forgot password 

                        //User is Exist

                        var val = Math.floor(1000 + Math.random() * 9000);
                        var messageData = "Your Go Daala Verification Code is: " + val;
                        var mobileno = req.body.phone_number;


                        axios.get('http://api.veevotech.com/sendsms?hash=3defxp3deawsbnnnzu27k4jbcm26nzhb9mzt8tq7&receivenum=' + mobileno + '&sendernum=8583&textmessage=' + messageData)
                            .then(response => {


                                OTP.create({
                                    otp: val,
                                    phone_number: mobileno
                                }).then(otp => {

                                    return res.status(200).send({
                                        status: 200,
                                        message: "OTP send successfully"
                                    });

                                }).catch(error => {
                                    return res.status(200).send({
                                        status: 400,
                                        message: error
                                    });
                                });


                            })
                            .catch(error => {
                                return res.status(200).send({
                                    status: 400,
                                    message: error
                                });
                            });


                    }
                })
                .catch(err => {
                    return res.status(200).send({
                        status: 400,
                        message: err
                    });
                });

        }
        if (req.body.type == "register") {
            var val = Math.floor(1000 + Math.random() * 9000);
            var messageData = "Your Go Daala Verification Code is: " + val;
            var mobileno = req.body.phone_number;

            // axios.get('http://smsctp1.eocean.us:24555/api?action=sendmessage&username=mkhata_99095&password=pak@456&recipient='+mobileno+'&originator=99095&messagedata='+messageData)

            axios.get('http://api.veevotech.com/sendsms?hash=3defxp3deawsbnnnzu27k4jbcm26nzhb9mzt8tq7&receivenum=' + mobileno + '&sendernum=8583&textmessage=' + messageData)
                .then(response => {


                    OTP.create({
                        otp: val,
                        phone_number: mobileno
                    }).then(otp => {

                        return res.status(200).send({
                            status: 200,
                            message: "OTP send successfully"
                        });

                    }).catch(error => {
                        return res.status(200).send({
                            status: 400,
                            message: error
                        });
                    });


                })
                .catch(error => {
                    return res.status(200).send({
                        status: 400,
                        message: error
                    });
                });

        }
    }
};

//--------------------vendor Verify OTP-------------------------------------
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
                    status: 400,
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
                    status: 200,
                    message: "OTP Validation Success",
                });


            }).catch(err => {
                return res.status(200).send({
                    status: 400,
                    message: err.message,
                });
            });




        }).catch(err => {
            return res.status(200).send({
                status: 400,
                message: err.message,
            });
        });
    }


}