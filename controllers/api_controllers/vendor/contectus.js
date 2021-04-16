const db = require("../../../models/api_models");

const Contect_us = db.contect_us;
//---------------vendor contect to admin -----------------
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
            vendor_id: req.body.vendor_id,
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
                            vendor_id: contect.vendor_id
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


//---------------vendor get all reply list from admin -----------------
exports.get_reply = function (req, res) {
    Contect_us.findAll({
        where: {
            vendor_id: req.body.vendor_id
            // admin_id:"1"
        }
    }).then(all_vendor_record => {
        if (all_vendor_record!=null|| all_vendor_record!='') {
            return res.status(200).send({
                status: 200,
                message: "vendor reply is successfuly received",
                successData: {
                    all_reply_vendor_record: {
                        all_vendor_record: all_vendor_record
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
