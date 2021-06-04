const db = require("../../../models/api_models");
const Product = db.product;

var fs = require("fs");
//-------------driver app create product--------------------
exports.product_create = (req, res) => {
    console.log("this is driver product created");
    req.checkBody('driver_id', 'driver id  must have needed!').notEmpty();
    req.checkBody('name', 'Product name  must have needed!').notEmpty();
    req.checkBody('product_type', 'Product type must have needed!').notEmpty();
    req.checkBody('price', 'Product price  must have needed!').notEmpty();
    req.checkBody('location', 'Product Location must have needed!').notEmpty();
    req.checkBody('latitude', 'latitude  must have needed!').notEmpty();
    req.checkBody('longitude', 'longitude  must have needed!').notEmpty();
    req.checkBody('details', 'phone number must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Product Create",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        
        if (!req.files) {
            req.checkBody('image', 'Product picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Product Create",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('image', 'Product picture must have needed animage').isImage(req.files.image.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Product Create",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = './public/files/';
                var filename = 'profile-1' + Date.now() + req.files.image.name;
                req.files.image.mv(path_file + '' + filename, function (err) {
                    if (err) console.log("error occured");
                });


                // Save driver app product to Database
                Product.create({
                    name: req.body.name,
                    product_type:req.body.product_type,
                    price: req.body.price,
                    location: req.body.location,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    details: req.body.details,
                    driver_id: req.body.driver_id,
                    image: '/public/files/' + filename,
                    admin_id:null,

                    total_rating: "0",
                    total_review: "0"
                    //  
                }).then(product => {

                    return res.status(200).send({
                        status: 200,
                        message: "Product Created is successful",
                        successData: {
                            product: product
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

//-------------driver app product-update --------------------
exports.product_update = (req, res) => {
    req.checkBody('product_id', 'product id must have id!').notEmpty();
    req.checkBody('driver_id', 'driver id  must have needed!').notEmpty();
    req.checkBody('name', 'Product name  must have needed!').notEmpty();
    req.checkBody('product_type', 'Product type must have needed!').notEmpty();
    req.checkBody('price', 'Product price  must have needed!').notEmpty();
    req.checkBody('location', 'Product Location must have needed!').notEmpty();
    req.checkBody('latitude', 'latitude  must have needed!').notEmpty();
    req.checkBody('longitude', 'longitude  must have needed!').notEmpty();
    req.checkBody('details', 'phone number must have value!').notEmpty();
    req.checkBody('old_image', 'Old image must have needed').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in upate product",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        if (!req.files) {
            req.checkBody('image', 'Product picture must have needed!').notEmpty();
            var errors = req.validationErrors();
            if (errors) {                    //////////------input file validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Product Create",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            }
        } else {
            req.checkBody('image', 'Product picture must have needed animage').isImage(req.files.image.name);
            var errors = req.validationErrors();
            if (errors) {   //////////------input file must have image validation error
                return res.status(200).send({
                    status: 400,
                    message: "validation error in Product Create",
                    successData: {
                        error: {
                            error: errors
                        }
                    }
                });
            } else {   ///------------------ no error exist

                var path_file = './public/files/';
                var filename = 'profile-1' + Date.now() + req.files.image.name;
                req.files.image.mv(path_file + '' + filename, function (err) {
                    if (err) console.log("error occured");
                });


                fs.unlink('.' + req.body.old_image, function (err) {
                    if (err) {
                        console.log("err occer file not deleted");
                    } else {
                        console.log("file  deleted");
                    }
                })

                Product.update({
                    name: req.body.name,
                    product_type:req.body.product_type,
                    price: req.body.price,
                    location: req.body.location,
                    details: req.body.details,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                    driver_id: req.body.driver_id,
                    image: '/public/files/' + filename,
                    admin_id:null,

                },
                    {
                        where: { id: req.body.product_id },
                        returning: true,
                        plain: true
                    },
                ).then(product => {

                    if (product != null || product != '') {

                        return res.status(200).send({
                            status: 200,
                            message: "Product UPDATED is successful",
                            successData: {
                                product: product[1]
                            }
                        });
                    } else {
                        return res.status(200).send({
                            status: 400,
                            message: "Product not UPDATED error",
                            successData: {
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


//------------ driver app product-delete ------------------
exports.product_delete = (req, res) => {
    req.checkBody('product_id', 'product_id must have value!').notEmpty();
    req.checkBody('driver_id', 'driver_id must have value!').notEmpty();
    req.checkBody('old_image', 'Please provide old image  value');

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in delete product",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {


     
        Product.destroy({
            where: {
                id: req.body.product_id,
                driver_id:req.body.driver_id
            }
        }).then(product => {

            if (!product) {
                return res.status(200).send({
                    status: 400,
                    message: "product not found",
                    successData: {

                    }
                });
            } else {


                fs.unlink('.' + req.body.old_image, function (err) {
                    if (err) {
                        console.log("err occer file not deleted");
                    } else {
                        console.log("file  deleted");
                    }
                });

                return res.status(200).send({
                    status: 200,
                    message: "product successfuly delete",
                    successData: {}
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


//--------------driver all product index-------------------
exports.product_index = (req, res) => {
    req.checkBody('driver_id', 'driver_id must have id!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in driver product index",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Product.findAll({
            where: {
                driver_id: req.body.driver_id
            }
        })
            .then(product => {

                if (!product) {
                    return res.status(200).send({
                        status: 400,
                        message: "driver id Not found in DB.",
                        successData: {}
                    });
                }else{
                    return res.status(200).send({
                        status: 200,
                        message: "Get all driver products",
                        successData: {
                            product:product
                        }
                    });
                }

                
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


//--------------driver app Product details---------------
exports.product_details = (req, res) => {

    req.checkBody('driver_id', 'driver id must have id needed!').notEmpty();
    req.checkBody('product_id', 'Product id  must have id needed!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in Product details",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Product.findOne(
            
            {
                where: { id: req.body.product_id,
                        driver_id: req.body.driver_id },
                returning: true,
                plain: true
            },
        ).then(product => {
            if (product != null || product != '') {
            

                return res.status(200).send({
                    status: 200,
                    message: "Get Product details is successful",
                    successData: {
                        product:product.dataValues
                    }
                });
            }else{
                return res.status(200).send({
                    status: 400,
                    message: "Get Product details is  not found!",
                    successData: {
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


