const db = require("../../../models/api_models");

const Promo = db.promo;
const Used_promo = db.used_promos;
//---------------customer validate promo code -----------------
exports.validate_promo_code = (req, res) => {
    req.checkBody('customer_id', 'customer id must have id needed!').notEmpty();
    req.checkBody('code', 'promo code must have value!').notEmpty();
    req.checkBody('exp_date', 'Expariy date must have needed!').notEmpty();
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
        Promo.findAll({
            where: {
                code: req.body.code
            }
        }).then(Promos => {
            //if User not found with given ID
            if (Promos==null|| Promos=='') {


                console.log("track not exist in db");
                return res.status(200).send({
                    status: 400,
                    message: "promo code is invalid",
                    successData: {

                    }
                });
            } else {
              
                Promos.forEach(item => {

                    if ((item.dataValues.publish == "on") && (req.body.exp_date <= item.dataValues.exp_date)) {
                        Used_promo.findOne({
                            where: {
                                promo_id: item.dataValues.id,
                                customer_id: req.body.customer_id
                            }
                        }).then(used => {
                            if (used) {
                                return res.status(200).send({
                                    status: 400,
                                    message: "promo code is used for this id",
                                    successData: {}
                                });
                            } else {
                                Used_promo.create({

                                    customer_id: req.body.customer_id,
                                    promo_id: item.dataValues.id


                                }).then(use_promo => {
                                    if (use_promo) {
                                        return res.status(200).send({
                                            status: 200,
                                            message: "Promo code is successfuly validate",
                                            successData: {
                                                promo_data: {
                                                    promo: item.dataValues
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
                        }).catch(err => {

                            return res.status(200).send({
                                status: 400,
                                message: err.message,
                                successData: {}
                            });

                        });

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
        }).catch(err => {
            console.log("track catch");
            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: {}
            });

        });
    }
}