const db = require("../../../models/api_models");
const Product = db.product;
const Admin = db.admin;
const Driver = db.driver;
const Review = db.review;

//---------------customer get all product -----------------
exports.get_all_product = (req, res) => {

    Product.findAll({
        include: [
            {
                model: db.admin
            }, {
                model: db.driver
            }
        ]
    }).then(all_product => {
        if (!all_product) {
            return res.status(200).send({
                status: 400,
                message: "no recode is exist",
                successData: {
                }
            });
        } else {
            return res.status(200).send({
                status: 200,
                message: "list of all Products ",
                successData: {
                    all_product_list: all_product


                }
            });


        }

    }).catch(err => {
        return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {

            }
        });
    });
}


//---------------customer get single product product detail with review -----------------
exports.get_single_product = async (req, res) => {
    req.checkBody('product_id', 'Product id must have needed!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get single product",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        const single_product = await Product.findOne({
            where: { id: req.body.product_id }, include: [
                {
                    model: db.admin
                },
                {
                    model: db.driver
                }
            ]
        });
        if (!single_product) {
            return res.status(200).send({
                status: 400,
                message: "no recode is exist",
                successData: {
                }
            });
        } else {

            const review = await Review.findAll({ 
                where: { product_id: req.body.product_is }, include: [
                    {
                        model: db.customer
                    }
                ]
             });
            if (review != null) {
                return res.status(200).send({
                    status: 200,
                    message: "detail of Product",
                    successData: {
                        single_product_detail: single_product,
                        reviews: review

                    }
                });
            } else{
                return res.status(200).send({
                    status: 200,
                    message: "detail of Product",
                    successData: {
                        single_product_detail: single_product,
                        reviews: "null"

                    }
                });
            }
        }


    }
}

//---------------customer get recent product  detail with review -----------------
exports.get_recent_product = async (req, res) => {
    req.checkBody('product_id', 'Product id must have needed!').notEmpty();
    req.checkBody('customer_id', 'Customer id must have needed!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in get recent product",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        const single_product = await Product.findOne({
            where: { id: req.body.product_id,
             }, include: [
                {
                    model: db.admin
                },
                {
                    model: db.driver
                }
            ]
        });
        if (!single_product) {
            return res.status(200).send({
                status: 400,
                message: "no recode is exist",
                successData: {
                }
            });
        } else {

            const review = await Review.findAll({ 
                where: { product_id: req.body.product_is }, include: [
                    {
                        model: db.customer
                    }
                ]
             });
            if (review != null) {
                return res.status(200).send({
                    status: 200,
                    message: "detail of Product",
                    successData: {
                        single_product_detail: single_product,
                        reviews: review

                    }
                });
            } else{
                return res.status(200).send({
                    status: 200,
                    message: "detail of Product",
                    successData: {
                        single_product_detail: single_product,
                        reviews: "null"

                    }
                });
            }
        }


    }
}


