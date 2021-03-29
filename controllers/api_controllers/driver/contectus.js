const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver = db.driver;
const Contect_us = db.contect_us;
const Op = db.Sequelize.Op;
//--------------driver contect a message to admin  ----------------------
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

//--------------driver get reply from admin  ----------------------
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
            driver_id:req.body.driver_id,
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