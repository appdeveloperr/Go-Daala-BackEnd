const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Vendor = db.vendor;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {



    // Save User to Database
    Vendor.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });



        return res.status(200).send({
            status: 200,
            message: "Signing Up",
            successData: {
                user: {
                    id: user.id,
                    username: user.username,
                    email:user.email,
                    accessToken: token
                }
            }
        });

    })
        .catch(err => {

            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: { }
            });

        });
};



exports.signin = (req, res) => {
    Vendor.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {

            if (!user) {
                return res.status(200).send({
                    status: 400,
                    message: "User Not found.",
                    successData: { }
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
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
                        username: user.username,
                        email:user.email,
                        accessToken: token
                    }
                }
    
            });

        })
        .catch(err => {
            return res.status(200).send({
                status: 400,
                message: err.message,
                successData: { }
            });
        });
};

