const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Driver = db.driver;
const Vehicle_reg = db.vehicle_reg;
const Vehicle = db.vehicle;
const fs = require('fs');

//-------------Driver create vehicle register--------------------
exports.create_vehicle_reg = (req, res) => {


    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    req.checkBody('vehicle_type', 'vehicle_type must have value!').notEmpty();
    req.checkBody('brand', 'brand must have value!').notEmpty();
    req.checkBody('model', 'model must have value!').notEmpty();
    req.checkBody('number_plate', 'number_plate must have value!').notEmpty();
    req.checkBody('color', 'color must have value!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in vehicle register",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {
            req.checkBody('vehicle_document', 'vehicle document picture must have needed!').notEmpty();
            req.checkBody('frint_image', 'frint image must have needed!').notEmpty();
            req.checkBody('back_image', 'back image License picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('vehicle_document', 'vehicle_document picture must have needed animage').isImage(req.files.vehicle_document.name);
            req.checkBody('frint_image', 'frint_image  must have needed animage').isImage(req.files.frint_image.name);
            req.checkBody('back_image', 'back image  must have needed animage').isImage(req.files.back_image.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = './public/files/uploadsFiles/driver/';


                //-----------------move vehicle document into server-------------------------------//
                var docfilename = 'profile-1' + Date.now() + req.files.vehicle_document.name;
                req.files.vehicle_document.mv(path_file + '' + docfilename, function (err) {
                    if (err) console.log("error occured");
                });

                //-----------------move frint_image into server-------------------------------//
                var frintfilename = 'profile-2' + Date.now() + req.files.frint_image.name;
                req.files.frint_image.mv(path_file + '' + frintfilename, function (err) {
                    if (err) console.log("error occured");
                });



                //-----------------move back_image into server-------------------------------//
                var backfilename = 'profile-3' + Date.now() + req.files.back_image.name;
                req.files.back_image.mv(path_file + '' + backfilename, function (err) {
                    if (err) console.log("error occured");
                });



                // Save vendor to Database
                Vehicle_reg.create({
                    driver_id: req.body.driver_id,
                    vehicle_type: req.body.vehicle_type,
                    vehicle_document: '/files/uploadsFiles/driver/' + docfilename,
                    brand: req.body.brand,
                    model: req.body.model,
                    number_plate: req.body.number_plate,
                    color: req.body.color,
                    frint_image: '/files/uploadsFiles/driver/' + frintfilename,
                    back_image: '/files/uploadsFiles/driver/' + backfilename,
                    status: "deactive",


                }).then(vehicle_reg => {
                    Vehicle.findOne({ where: { vehicle_type: vehicle_reg.vehicle_type } }).then(vehicles => {


                        return res.status(200).send({
                            status: 200,
                            message: "Driver create Vehicle register is successful",
                            successData: {
                                vehicle: {
                                    id: vehicle_reg.id,
                                    vehicle_type: vehicle_reg.vehicle_type,
                                    vehicle_document: vehicle_reg.vehicle_document,
                                    brand: vehicle_reg.brand,
                                    model: vehicle_reg.model,
                                    number_plate: vehicle_reg.number_plate,
                                    color: vehicle_reg.color,
                                    frint_image: vehicle_reg.frint_image,
                                    back_image: vehicle_reg.back_image,
                                    status: vehicle_reg.status,
                                    driver_id: vehicle_reg.driver_id,
                                    service: vehicles.service,
                                    distance: vehicles.distance,
                                    time: vehicles.time,
                                    company_commission:vehicles.company_commission
                                }
                            }
                        });
                    })


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
                    vehicle_type_list: {
                        vehicle_list: all_vehicle

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

//-------------Driver update vehicle if  driver is unblock  ----------------------
exports.update_vehicle_reg = (req, res) => {
    req.checkBody('id', 'Vehicle id must have required');
    req.checkBody('driver_id', 'driver_id must have ID!').notEmpty();
    req.checkBody('vehicle_type', 'vehicle_type must have value!').notEmpty();
    req.checkBody('brand', 'brand must have value!').notEmpty();
    req.checkBody('model', 'model must have value!').notEmpty();
    req.checkBody('number_plate', 'number_plate must have value!').notEmpty();
    req.checkBody('color', 'color must have value!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in update vehicle register",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {
            req.checkBody('vehicle_document', 'vehicle document picture must have needed!').notEmpty();
            req.checkBody('frint_image', 'frint image must have needed!').notEmpty();
            req.checkBody('back_image', 'back image License picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('vehicle_document', 'vehicle_document picture must have needed animage').isImage(req.files.vehicle_document.name);
            req.checkBody('frint_image', 'frint_image  must have needed animage').isImage(req.files.frint_image.name);
            req.checkBody('back_image', 'back image  must have needed animage').isImage(req.files.back_image.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in vehicle register",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist
                Vehicle_reg.findOne({
                    where: {
                        id: req.body.id
                    }
                }).then(result => {

                    if (result != null || result != '') {

                        fs.unlink('./public' + result.dataValues.vehicle_document, function (err) {
                            if (err) {
                                console.log("err occer file not deleted");
                            } else {
                                console.log("file  deleted");
                            }
                        })

                        fs.unlink('./public' + result.dataValues.frint_image, function (err) {
                            if (err) {
                                console.log("err occer file not deleted");
                            } else {
                                console.log("file  deleted");
                            }
                        })

                        fs.unlink('./public' + result.dataValues.back_image, function (err) {
                            if (err) {
                                console.log("err occer file not deleted");
                            } else {
                                console.log("file  deleted");
                            }
                        })



                        var path_file = './public/files/uploadsFiles/driver/';


                        //-----------------move vehicle document into server-------------------------------//
                        var docfilename = 'profile-1' + Date.now() + req.files.vehicle_document.name;
                        req.files.vehicle_document.mv(path_file + '' + docfilename, function (err) {
                            if (err) console.log("error occured");
                        });

                        //-----------------move frint_image into server-------------------------------//
                        var frintfilename = 'profile-2' + Date.now() + req.files.frint_image.name;
                        req.files.frint_image.mv(path_file + '' + frintfilename, function (err) {
                            if (err) console.log("error occured");
                        });



                        //-----------------move back_image into server-------------------------------//
                        var backfilename = 'profile-3' + Date.now() + req.files.back_image.name;
                        req.files.back_image.mv(path_file + '' + backfilename, function (err) {
                            if (err) console.log("error occured");
                        });



                        // Save vendor to Database
                        Vehicle_reg.update({
                            driver_id: req.body.driver_id,
                            vehicle_type: req.body.vehicle_type,
                            vehicle_document: '/files/uploadsFiles/driver/' + docfilename,
                            brand: req.body.brand,
                            model: req.body.model,
                            number_plate: req.body.number_plate,
                            color: req.body.color,
                            frint_image: '/files/uploadsFiles/driver/' + frintfilename,
                            back_image: '/files/uploadsFiles/driver/' + backfilename,
                            status: "deactive",


                        }, {
                            where: {
                                id: result.dataValues.id
                            },
                            returning: true,
                            plain: true
                        }).then(vehicle_reg => {
                            return res.status(200).send({
                                status: 200,
                                message: "Driver create Vehicle register is successful",
                                successData: {
                                    vehicle: {
                                        id: vehicle_reg[1].id,
                                        vehicle_type: vehicle_reg[1].vehicle_type,
                                        vehicle_document: vehicle_reg[1].vehicle_document,
                                        brand: vehicle_reg[1].brand,
                                        model: vehicle_reg[1].model,
                                        number_plate: vehicle_reg[1].number_plate,
                                        color: vehicle_reg[1].color,
                                        frint_image: vehicle_reg[1].frint_image,
                                        back_image: vehicle_reg[1].back_image,
                                        status: vehicle_reg[1].status,
                                        driver_id: vehicle_reg[1].driver_id
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
                    } else {
                        return res.status(200).send({
                            status: 200,
                            message: "Driver create Vehicle register is successful",
                            successData: {
                                vehicle: {
                                    result

                                }
                            }
                        });
                    }
                })

            }
        }
    }

}
