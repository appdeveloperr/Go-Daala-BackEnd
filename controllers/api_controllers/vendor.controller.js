const db = require("../../models/api_models");
const config = require("../../config/auth.config");
const Vendor = db.vendor;
const Address = db.address;
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


exports.create_address = (req, res) => {
    // Save vendor to Database
    Address.create({
        label: req.body.label,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude

    }).then(address => {
        console.log(address);
        return res.status(200).send({
            status: 200,
            message: "Address Create is successful",
            successData: {
                address: {
                    id: address.id,
                    address: address.address,
                    latitude: address.latitude,
                    longitude: address.longitude

                }
            }
        });

    }).catch(err => {

        return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {}
        });

    });

}

exports.update_address = (req, res) => {
    Address.update({
        label: req.body.label,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    },
        {
            where: { id: req.body.id },
            returning: true,
            plain: true
        },
    ).then(address => {

        if (address) {

            return res.status(200).send({
                status: 200,
                message: "Address updated is successful",
                successData: {
                    address: {
                        id: address[1].id,
                        label: address[1].label,
                        address: address[1].address,
                        latitude: address[1].latitude,
                        longitude: address[1].longitude
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

exports.delete_address =(req, res)=>{
    Address.destroy({
        where: {
           id: req.body.id
        }
      }).then(address => {
  
        if (!address) {
            return res.status(200).send({
                status: 400,
                message: "Contacts not found",
                successData: {}
            });
        }
           
        return res.status(200).send({
            status: 200,
            message: "Vendor Address is successful Deleted",
            successData: {}
        });
  
      }).catch(err => {
        return res.status(200).send({
            status: 400,
            message: err.message,
            successData: {}
        });
      });
}