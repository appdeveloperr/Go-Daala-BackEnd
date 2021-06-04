const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Admin = db.admin;
var OTP = db.otp;
const axios = require('axios');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var fs = require("fs");
//-------------admin app signup--------------------
exports.signup = (req, res) => {

    req.checkBody('first_name', 'first_name must have value!').notEmpty();
    req.checkBody('last_name', 'last name must have value!').notEmpty();
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();
    req.checkBody('city', 'city must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();
    req.checkBody('fcm_token', 'Please provide a fcm token needed!')

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

                var path_file = './public/files/';
                var filename = 'admin-profile-1'+ Date.now() + req.files.profile.name;
                req.files.profile.mv(path_file + '' + filename, function (err) {
                    if (err) console.log("error occured");
                });
                var invite_code ='';
                if(req.body.invite_code){
                    invite_code = req.body.invite_code;
                }

                // Save admin app to Database
                Admin.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: bcrypt.hashSync(req.body.password, 8),
                    city: req.body.city,
                    profile: '/public/files/' + filename,
                    account_info: 'unblock',
                    fcm_token: req.body.fcm_token,
                    total_rating:"0",
                    total_review:"0",
                    invite_code:invite_code
                    //  
                }).then(user => {

                    var token = jwt.sign({ id: user.id }, config.secret, {
                    });

                    delete user.dataValues.password;
                    user.dataValues.accessToken=token;

                    return res.status(200).send({
                        status: 200,
                        message: "Signing Up is successful",
                        successData: {
                            user: user
                               
                            
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

//-------------admin app varify_email_and_phone_number--------------------
exports.varify_email_and_phone_number = (req, res) => {
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('phone_number', 'Phone number must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in varify email and phone number",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Admin.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {

                if (!user) {

                    Admin.findOne({
                        where: {
                            phone_number: req.body.phone_number
                        }
                    }).then(phone => {
                        if (!phone) {
                            return res.status(200).send({
                                status: 200,
                                message: "User email  and phone number is not found.",
                                successData: {
                                    Verification: {
                                        email: "false",
                                        phone_number: "false"
                                    }

                                }
                            });
                        } else {
                            return res.status(200).send({
                                status: 200,
                                message: "User email  is not found.",
                                successData: {
                                    Verification: {
                                        email: "false",
                                        phone_number: "true"
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

                } else {

                    if (user.phone_number != req.body.phone_number) {
                        return res.status(200).send({
                            status: 200,
                            message: "User email  found but phone number  is not found.",
                            successData: {
                                Verification: {
                                    email: "true",
                                    phone_number: "false"
                                }
                            }
                        });
                    } else {
                        return res.status(200).send({
                            status: 400,
                            message: "User email and phone number is already exist.",
                            successData: {
                                Verification: {
                                    email: "true",
                                    phone_number: "true"
                                }
                            }
                        });
                    }
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



//--------------admin app signin-------------------
exports.signin = (req, res) => {
    req.checkBody('email', 'email must have value!').notEmpty();
    req.checkBody('password', 'password must have value!').notEmpty();
    req.checkBody('fcm_token', 'Please provide fcm token value needed!');
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
        Admin.findOne({
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
                        message: "Invalid user Password!"
                    });
                }
                
                if (user.dataValues.account_info == 'block') {
                    return res.status(200).send({
                        status: 400,
                        message: "please wait for admin approvel.",
                        successData: {}
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret);
               
                Admin.update({
                    fcm_token: req.body.fcm_token
                }, {
                    where: {
                        id: user.dataValues.id
                    },
                    returning: true,
                    plain: true
                },).then(user => {
                    user[1].dataValues.accessToken=token;
                    delete user[1].dataValues.password;
                    return res.status(200).send({
                        status: 200,
                        message: "Login Successfull.",
                        successData: {
                            user: user[1]
                            
                        }
    
                    });
                }).catch(err => {
                    return res.status(200).send({
                        status: 400,
                        message: "this is catch 1 "+err.message,
                        successData: {}
                    });

                });


             

            })
            .catch(err => {
                return res.status(200).send({
                    status: 400,
                    message: "this is catch"+err.message,
                    successData: {}
                });
            });
    }
};


//--------------admin app profile update---------------
exports.update = (req, res) => {

    req.checkBody('first_name', 'first_name must have value!').notEmpty();
    req.checkBody('last_name', 'last name must have value!').notEmpty();
    req.checkBody('phone_number', 'phone number must have value!').notEmpty();
    req.checkBody('admin_id', 'admin id must have id!').notEmpty();

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
        Admin.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,

        },
            {
                where: { id: req.body.admin_id },
                returning: true,
                plain: true
            },
        ).then(user => {
            if (user != null || user != '') {
                var token = jwt.sign({ id: user.id }, config.secret, {
                });
                user[1].dataValues.accessToken = token;
                delete user[1].dataValues.password;
                return res.status(200).send({
                    status: 200,
                    message: "UPDATED is successful",
                    successData: {
                        user: user[1]
                        
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


//---------------admin app forgot password -----------------
exports.forgot_password = (req, res) =>{
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
        Admin.update({
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
                return res.status(200).send({
                    status: 200,
                    message: "Password UPDATED is successful",
                    successData: {
                        user: user[1]
                            
                        
                    }
                });
            } else {
                return res.status(200).send({
                    status: 400,
                    message: "this phone number is not exist in DB! please do this again with currect information",
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


//-------------------------update profile picture-----------------------/////////////
exports.update_picture = function (req, res) {
    req.checkBody('admin_id', 'admin id must have ID!').notEmpty();
    req.checkBody('file', 'old file must have oldpath needed!').notEmpty();

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



                var path_file = './public/files/';

                var file = req.files.new_profile;




                //-----------------move profile into server-------------------------------//
                var filename ='admin-profile-1'+Date.now() + req.files.new_profile.name;
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
                Admin.update({
                    profile: '/public/files/' + filename
                },
                    {
                        where: { id: req.body.admin_id },
                        returning: true,
                        plain: true
                    },
                ).then(user => {

                    if (user != null || user != '') {
                        var token = jwt.sign({ id: user.id }, config.secret);
                      user[1].dataValues.accessToken= token;
                        delete user[1].dataValues.password;
                        return res.status(200).send({
                            status: 200,
                            message: "Profile picture is  UPDATED is successful",
                            successData: {
                                user: user[1]
                                
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

//------------------admin app SendOTP------------------------------------

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
            Admin.findOne({
                where: {
                    phone_number: req.body.phone_number
                }
            })
                .then(user => {

                    if (!user) {
                        //User is not Exist 
                        return res.status(200).send({
                            status: 400,
                            message: "This user phone number is not found",
                            successData: {}
                        });

                    } else {  //User is forgot password 

                        //User is Exist

                        var val = Math.floor(1000 + Math.random() * 9000);
                        var messageData = "Your Delivery Takers Verification Code is: " + val;
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
            var messageData = "Your Delivery Takers Verification Code is: " + val;
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
    }
};

//--------------------admin app Verify OTP-------------------------------------
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