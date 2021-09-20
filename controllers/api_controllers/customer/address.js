const db = require("../../../models/api_models");
const Address = db.address;

//--------------customer create address---------------
exports.create_address = (req, res) => {
    req.checkBody('label', 'label must have value!').notEmpty();
    req.checkBody('address', 'address must have value!').notEmpty();
    req.checkBody('latitude', 'latitude must have value!').notEmpty();
    req.checkBody('longitude', 'longitude must have value!').notEmpty();
    req.checkBody('customer_id', 'customer_id must have value!').notEmpty();


    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in create address",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        // Save customer to Database
        Address.create({
            label: req.body.label,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            customer_id: req.body.customer_id

        }).then(addresss => {
            return res.status(200).send({
                status: 200,
                message: "Address Create is successful",
                successData: {
                    address: {
                        id: addresss.id,
                        address: addresss.address,
                        latitude: addresss.latitude,
                        longitude: addresss.longitude,
                        customer_id: addresss.customer_id

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

}

//--------------customer update address------------
exports.update_address = (req, res) => {
    req.checkBody('label', 'label must have value!').notEmpty();
    req.checkBody('address', 'address must have value!').notEmpty();
    req.checkBody('latitude', 'latitude must have value!').notEmpty();
    req.checkBody('longitude', 'longitude must have value!').notEmpty();



    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in update address",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
        Address.update({
            label: req.body.label,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,

        },
            {
                where: { id: req.body.id },
                returning: true,
                plain: true
            },
        ).then(address => {

            if (address!=null|| address!='') {

                return res.status(200).send({
                    status: 200,
                    message: "Address updated is successful",
                    successData: {
                        address: {
                            id: address[1].id,
                            label: address[1].label,
                            address: address[1].address,
                            latitude: address[1].latitude,
                            longitude: address[1].longitude,
                            customer_id: address[1].customer_id
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
}

//--------------customer delete address------------
exports.delete_address = (req, res) => {
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
            message: "customer Address is successful Deleted",
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

//--------------customer get all address------------
exports.index_address = (req, res) => {
	req.checkBody('customer_id', 'customer id must have value!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation error in all address",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
    Address.findAll({
		where:{customer_id:req.body.customer_id}
	}).then(all_address => {
        if (!all_address) {
            return res.status(200).send({
                status: 400,
                message: "no recode exist",
                successData: {

                }
            });
        }
        return res.status(200).send({
            status: 200,
            message: "Get all customer address",
            successData: {
                address: {
                    all_address: all_address
                }
            }
        });



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
	}
}