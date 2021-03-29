const db = require("../../models/api_models");
const Trips = db.trip;
const Vendor = db.vendor;
const Driver = db.driver;
const Cancel_trip = db.cencel_trip;




//--------Booking Index Function -----------------
exports.index = function (req, res) {

    Trips.findAll().then(all_trips => {
        if (!all_trips) {
            console.log("no trips  recode is exist")
        } else {

            Vendor.findAll().then(all_vendor => {
                if (!all_vendor) {
                    console.log("no vendor recode is exist")
                } else {
                    Driver.findAll().then(all_driver => {
                        res.render('./admin/booking/index', {
                            userdata: req.user,
                            all_trips: all_trips,
                            all_vendor: all_vendor,
                            all_driver: all_driver,
                            state: 'ONGOING'
                        })


                    }).catch(err => {
                        return res.status(200).send({
                            responsecode: 400,
                            message: err.message,
                        });
                    });
                }
            }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });

        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}

//--------Booking complete Function -----------------
exports.complete = function (req, res) {

    Trips.findAll({where:{
        status:"end"
    }}).then(all_trips => {

        if (!all_trips) {
            console.log("no trips  recode is exist")
        } else {
            Vendor.findAll().then(all_vendor => {
                if (!all_vendor) {
                    console.log("no vendor recode is exist")
                } else {
                    Driver.findAll().then(all_driver => {
                        res.render('./admin/booking/index', {
                            userdata: req.user,
                            all_trips: all_trips,
                            all_vendor: all_vendor,
                            all_driver: all_driver,
                            state: 'COMPLETE'
                        })


                    }).catch(err => {
                        return res.status(200).send({
                            responsecode: 400,
                            message: err.message,
                        });
                    });
                }
            }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });

        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}

//--------Booking cancel Function -----------------
exports.cancel = function (req, res) {
    Cancel_trip.findAll().then(all_cancel_trip => {
        if (!all_cancel_trip) {
            console.log(all_cancel_trip);
        } else {
            Trips.findAll({
                where: {
                    status: 'cancel'
                }
            }).then(all_trips => {
                if (!all_trips) {
                    console.log("no trips  recode is exist")
                } else {

                    Vendor.findAll().then(all_vendor => {
                        if (!all_vendor) {
                            console.log("no vendor recode is exist")
                        } else {
                            Driver.findAll().then(all_driver => {
                                res.render('./admin/booking/cancel_booking', {
                                    userdata: req.user,
                                    all_cancel_trip:all_cancel_trip,
                                    all_trips: all_trips,
                                    all_vendor: all_vendor,
                                    all_driver: all_driver,
                                    state: 'CANCEL'
                                })


                            }).catch(err => {
                                return res.status(200).send({
                                    responsecode: 400,
                                    message: err.message,
                                });
                            });
                        }
                    }).catch(err => {
                        return res.status(200).send({
                            responsecode: 400,
                            message: err.message,
                        });
                    });

                }
            }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });

        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });

}

exports.test = (req, res) => {
    res.render('./admin/test')
}
