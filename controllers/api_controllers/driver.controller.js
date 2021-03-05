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
};


//--------------vendor signin-------------------
exports.signin = (req, res) => {
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
};


//--------------Driver profile update---------------
exports.update = (req, res) => {
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


//-------------Driver create vehicle register--------------------
exports.create_vehicle_reg = (req, res) => {
    // Save vendor to Database
    Vehicle_reg.create({
        vehicle_type: req.body.vehicle_type,
        vehicle_document: '/public/files/uploadsFiles/vendor/' + req.files.vehicle_document.name,
        brand: req.body.brand,
        model: req.body.model,
        number_plate: req.body.number_plate,
        color: req.body.color,
        frint_image: '/public/files/uploadsFiles/vendor/' + req.files.frint_image.name,
        back_image: '/public/files/uploadsFiles/vendor/' + req.files.back_image.name,
        status: "deactive"

    }).then(vehicle_reg => {

        return res.status(200).send({
            status: 200,
            message: "Driver create Vehicle register is successful",
            successData: {
                user: {
                    id: vehicle_reg.id,
                    vehicle_document: vehicle_reg.vehicle_document,
                    brand: vehicle_reg.brand,
                    model: vehicle_reg.model,
                    number_plate: vehicle_reg.number_plate,
                    color: vehicle_reg.color,
                    frint_image: vehicle_reg.frint_image,
                    back_image: vehicle_reg.back_image,
                    status: vehicle_reg.status
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
                    vehicle: {
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






