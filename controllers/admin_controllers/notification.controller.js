const db = require("../../models/api_models");
const Trips = db.trip;
const Vendor = db.vendor;
const Driver = db.driver;
var admin = require("firebase-admin");
const notification = db.notification;
var serviceAccount = require("../../config/go-daala-prod-firebase-adminsdk-kx7hm-c8b83fe095.json");
const { customer } = require("../../models/api_models");



// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://go-daala-prod-default-rtdb.firebaseio.com/"
// });

//-----admin get all notification --------------------
exports.notification_index = function (req, res) {
    notification.findAll().then(all_notification => {
        if (!all_notification) {
            console.log("no recode is exist")
        } else {
            res.render('admin/notification/index', {
                userdata: req.user,
                all_notification: all_notification
            })
        }

    });
}


//-----admin get create notification  --------------------
exports.create = function (req, res) {
    Driver.findAll().then(all_drivers => {
        if (all_drivers) {
            Vendor.findAll().then(all_vendors => {
                if (all_vendors) {
                    customer.findAll().then(all_customers => {
                        if (all_customers) {
                            res.render('admin/notification/create', {
                                userdata: req.user,
                                all_drivers: all_drivers,
                                all_vendors: all_vendors,
                                all_customer: all_customers,
                                title: '',
                                disc: ''
                            })
                        }
                    }).catch(err => {

                        return res.status(200).send({
                            status: 400,
                            message: err.message,
                            successData: {}
                        });

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
    }).catch(err => {

        return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {}
        });

    });

};

//sendReminder to person
exports.sendReminder = (req, res) => {



    if (req.body.user_phone !== null && req.body.user_phone !== "" && req.body.user_phone !== 0) {

        User.findOne({
            where: {
                phone: req.body.user_phone
            }
        }).then(user => {
            //if User not found with given ID
            if (!user) {
                return res.status(200).send({
                    responsecode: 400,
                    message: "User Not found."
                });
            }

            //If User is exist then moving to Contact
            Contact.findOne({
                where: {
                    user_phone: req.body.user_phone,
                    phone: req.body.phone
                }
            }).then(contact => {


                if (!contact) {
                    return res.status(200).send({
                        responsecode: 400,
                        message: "Contact not Exist",
                    });
                }



                //Getting FCM of Contact from Users Table
                User.findOne({
                    where: {
                        phone: contact.phone
                    }
                }).then(user => {
                    //if User not found with given ID
                    if (!user) {
                        return res.status(200).send({
                            responsecode: 400,
                            message: "Contact User Not found."
                        });
                    }

                    //Creating InAppNotification
                    createInAppNotification(req, res, user.fcmtoken);

                    // //Sending Notification NOW
                    // sendFCM(req,res,user.fcmtoken, req.body.title, req.body.body);

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


        }).catch(err => {
            return res.status(200).send({
                responsecode: 400,
                message: err.message,
            });
        });


    } else {

        return res.status(200).send({
            responsecode: 400,
            message: "Invalid User Phone",
        });

    }

};



//sendtoAll Notification
exports.sendtoAll = (req, res) => {
    req.checkBody('title', 'Title must have needed!').notEmpty();
    req.checkBody('disc', 'Discreption must have needed!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('admin/notification/create', {
            errors: errors,
            title: req.body.title,
            disc: req.body.disc
        });
    } else {
        var payload = {
            notification: {
                title: req.body.title,
                body: req.body.disc
            }
        };

        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        const myarray = [];
        if (req.body.driver == 'All_drivers') {
            Driver.findAll().then(all_drivers => {
                if (all_drivers) {

                    all_drivers.forEach(element => {
                        myarray.push(try_to_parse(element.fcm_token))
                    });


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

                }
            })
        } if (req.body.vendor == 'All_vendors') {
            Vendor.findAll().then(all_vendors => {
                if (all_vendors) {

                    all_vendors.forEach(element => {
                        myarray.push(try_to_parse(element.fcm_token))
                    });


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

                }
            });
        }
        if (req.body.driver == 'spacific_driver') {


            admin.messaging().sendToDevice(try_to_parse(req.body.driver_fcm), payload, options)
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


        }
        if (req.body.vendor == 'spacific_vendor') {


            admin.messaging().sendToDevice(try_to_parse(req.body.vendor_fcm), payload, options)
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


        }
        if (req.body.customer == 'All_customers') {
            Customer.findAll().then(all_customers => {
                if (all_customers) {

                    all_customers.forEach(element => {
                        myarray.push(try_to_parse(element.fcm_token))
                    });


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

                }
            });
        }
        if (req.body.customer == 'spacific_customer') {


            admin.messaging().sendToDevice(try_to_parse(req.body.customer_fcm), payload, options)
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


        }

        notification.create({
            title: req.body.title,
            body: req.body.disc
        }).then(notific => {
            if (notific) {
                req.flash('success', 'Successfuly your notification  is  created');
                res.redirect('/admin/notification/index');
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


function try_to_parse(token) {
    try {
        return JSON.parse(token);
    } catch (e) {
        return token;
    }
}

//Get All getNotifications
exports.getNotifications = (req, res) => {

    if (req.body.user_phone !== null && req.body.user_phone !== "" && req.body.user_phone !== 0) {

        User.findOne({
            where: {
                phone: req.body.user_phone
            }
        }).then(user => {
            //if User not found with given ID
            if (!user) {
                return res.status(200).send({
                    responsecode: 400,
                    message: "User Not found."
                });
            }

            //If User is exist then moving to Contact
            Notification.findAll({
                where: {
                    user_phone: req.body.user_phone
                },
                order: [
                    ['id', 'DESC'],
                ],
            }).then(notifications => {

                if (!notifications) {
                    return res.status(200).send({
                        responsecode: 200,
                        message: "Notifications not found",
                    });
                }

                return res.status(200).send({
                    responsecode: 200,
                    message: "success",
                    successData: {
                        notifications: notifications
                    }
                });

            })
                .catch(err => {
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


    } else {

        return res.status(200).send({
            responsecode: 400,
            message: "Invalid User Phone",

        });

    }

};


//Get All clearNotifications
exports.clearNotifications = (req, res) => {

    if (req.body.user_phone !== null && req.body.user_phone !== "" && req.body.user_phone !== 0) {

        User.findOne({
            where: {
                phone: req.body.user_phone
            }
        }).then(user => {
            //if User not found with given ID
            if (!user) {
                return res.status(200).send({
                    responsecode: 400,
                    message: "User Not found."
                });
            }

            //If User is exist then moving to Contact
            Notification.destroy({
                where: {
                    user_phone: req.body.user_phone
                }
            }).then(notifications => {

                if (!notifications) {
                    return res.status(200).send({
                        responsecode: 200,
                        message: "Notifications not found",
                    });
                }

                return res.status(200).send({
                    responsecode: 200,
                    message: "Notifications cleared success",
                });

            })
                .catch(err => {
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


    } else {

        return res.status(200).send({
            responsecode: 400,
            message: "Invalid User Phone",

        });

    }

};




//setAllRead Notification
exports.setAllRead = (req, res) => {

    if (req.body.user_phone !== null && req.body.user_phone !== "" && req.body.user_phone !== 0) {

        User.findOne({
            where: {
                phone: req.body.user_phone
            }
        }).then(user => {
            //if User not found with given ID
            if (!user) {
                return res.status(200).send({
                    responsecode: 400,
                    message: "User Not found."
                });
            }

            //If User is exist then moving to Contact

            Notification.update(
                {
                    is_read: 1
                },
                {
                    where: {
                        user_phone:
                            req.body.user_phone
                    },
                },
            ).then(result => {



                return res.status(200).send({
                    responsecode: 200,
                    message: "All Notification Marked as Read",

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


    } else {

        return res.status(200).send({
            responsecode: 400,
            message: "Invalid User Phone",

        });

    }

};







//----------- Functions ----------------

function createInAppNotification(req, res, fcmtoken) {

    Notification.create({
        user_phone: req.body.phone,
        phone: req.body.user_phone,
        title: req.body.title,
        body: req.body.body,
        is_read: 0
    }).then(notification => {




        //Sending Notification NOW
        sendFCM(req, res, fcmtoken, req.body.title, req.body.body);


    }).catch(err => {
        return res.status(200).send({

            responsecode: 400,
            message: err.message,
        });
    });


};


function sendFCM(req, res, fcmtoken, title, body) {

    //var fcmtoken = "d0EyvrFoS6GyVdidCD-2RM:APA91bFgmAeYmpzs0zUTFVimCz3H2Vq_8-ZEmHaddLNKvT0PJZXs-VkW7Hf8on94ehfhGAIvUCSd97NXHQ7qSUc_JVaDc0ySTde3HcBbo0d_UAeEoE_eGmOrIn5J3uFudxkIzyGbjaNj";
    // return res.status(200).send({
    //     responsecode: 200,
    //     message: "Notification send krne lga tha",
    //     title: title,
    //     body:body,
    //     fcmtoken: fcmtoken
    // });

    console.log("FCM TOKEN COMING: " + fcmtoken);

    var payload = {
        notification: {
            title: title,
            body: body
        }
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(fcmtoken, payload, options)
        .then(function (response) {

            // return res.status(200).send({
            //     responsecode: 200,
            //     successData:  response.results[0]
            // })

            console.log("Successfully sent message:", response.results[0]);

            return res.status(200).send({
                responsecode: 200,
                message: "Notification Created Successfully",
            });
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
            return res.status(200).send({
                responsecode: 400,
                notification: response.results[0]
            })
        });

};

