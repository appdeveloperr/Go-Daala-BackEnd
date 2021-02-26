const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Vendor = db.vendor;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");





exports.signup = (req, res) => {

    // Save vendor to Database
    Vendor.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: bcrypt.hashSync(req.body.password, 8),
        profile: ''
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




exports.signin = (req, res) => {
    Vendor.findOne({
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

exports.update = (req, res) => {
    Vendor.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,

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
                        profile: user[1].profile,
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

