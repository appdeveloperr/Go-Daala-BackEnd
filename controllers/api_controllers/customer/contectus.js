const db = require("../../../models/api_models");

const Contect_us = db.contect_us;
//---------------customer contect to admin -----------------
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
            customer_id: req.body.customer_id,
            message_holder:'null',
            driver_id:'null'


        }).then(contect => {
            if (contect!=null|| contect!='') {
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
                            customer_id: contect.customer_id
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


//---------------customer get all reply list from admin -----------------
exports.get_reply = function (req, res) {
    Contect_us.findAll({
        where: {
            customer_id: req.body.customer_id
            // admin_id:"1"
        }
    }).then(all_customer_record => {
        if (all_customer_record!=null|| all_customer_record!='') {
            return res.status(200).send({
                status: 200,
                message: "customer reply is successfuly received",
                successData: {
                    all_reply_customer_record: {
                        all_customer_record: all_customer_record
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
