const db = require("../../models/api_models");
const Contect_us = db.contect_us;




//--------Help and Support Index Function -----------------
exports.index = function (req, res) {

    Contect_us.findAll().then(all_contect => {
        if (!all_contect) {
            console.log("no recode is exist")
        }
        res.render('./admin/help_support/index', {
            userdata: req.user,
            all_contect: all_contect

        });

    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}




//---------Help and Support  reply Function -----------------
exports.reply = function (req, res) {
    Contect_us.findOne({
        where: {
            id: req.params.id
        }
    }).then(one_contect_record => {
        //if User not found with given ID
        if (one_contect_record) {
            if (one_contect_record.dataValues.driver_id!=null || one_contect_record.dataValues.driver_id!='') {
                Contect_us.findAll({
                    where: {
                        driver_id: one_contect_record.dataValues.driver_id
                    }
                }).then(all_contect_record => {
                    if (all_contect_record) {
                       
                        res.render('./admin/help_support/reply', {
                            userdata: req.user,
                            all_contect_record: all_contect_record
                        });
                    }
                }).catch(err => {
                    return res.status(200).send({
                        responsecode: 400,
                        message: err.message,
                    });
                });
            } else if (one_contect_record.dataValues.vendor_id!=null ||one_contect_record.dataValues.vender_id!='') {
                Contect_us.findAll({
                    where: {
                        vendor_id: one_contect_record.dataValues.vendor_id
                    }
                }).then(all_contect_record => {
                    if (all_contect_record) {
                        res.render('./admin/help_support/reply', {
                            userdata: req.user,
                            all_contect_record: all_contect_record
                        });
                    }
                }).catch(err => {
                    return res.status(200).send({
                        responsecode: 400,
                        message: err.message,
                    });
                });

            }

        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });

}


//---------Help and Support admin upload reply Function -----------------
exports.upload_reply = function (req, res) {
    req.checkBody('content', 'Reply text must have needed!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.flash('danger', 'Reply text must have needed!');
        res.redirect('/contect_us/reply/' + req.body.id);
    } else {
        Contect_us.create({
            first_name: req.body.admin_name[0],
            last_name: req.body.admin_name[0],
            email: req.body.admin_email[0],
            message: req.body.content,
            driver_id: req.body.driver_id[0],
            vendor_id: req.body.vendor_id[0],
            admin_id: req.body.admin_id[0],
        }).then(banner => {
            res.redirect('/contect_us/reply/' + req.body.id[0]);
        }).catch(err => {
            console.log(err);
        });
    }
}

