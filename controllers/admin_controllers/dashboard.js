const db = require("../../models/api_models");
const Banner = db.banner;
const Promo = db.promo;
const Vehicle = db.vehicle;
const Booking = db.trip;
const Vendor = db.vendor;
const Driver = db.driver;
const help_and_support = db.contect_us;
const FAQS = db.faqs;
const Customer = db.customer;

exports.Dishboard = (req, res) => {
    Banner.findAndCountAll().then(Banners => {

        Promo.findAndCountAll().then(Promos => {

            Vehicle.findAndCountAll().then(vehicles => {

                Booking.findAndCountAll().then(Bookings => {

                    Vendor.findAndCountAll().then(Vendors => {

                        Driver.findAndCountAll().then(Drivers => {

                            Customer.findAndCountAll().then(Customers => {

                                help_and_support.findAndCountAll().then(Helps_and_Support => {

                                    FAQS.findAndCountAll().then(FAQs => {


                                        res.render('admin/index', {
                                            Banner: Banners.count,
                                            Promo: Promos.count,
                                            Vehicle: vehicles.count,
                                            Booking: Bookings.count,
                                            Vendor: Vendors.count,
                                            Customer: Customers.count,
                                            Driver: Drivers.count,
                                            help_and_support: Helps_and_Support.count,
                                            FAQS: FAQs.count
                                        });

                                    }).catch(err => {
                                        return res.status(200).send({
                                            responsecode: 400,
                                            message: err.message,
                                        });
                                    });

                                }).catch(err => {
                                    return res.status(200).send({
                                        responsecode: 400,
                                        message: err.message,
                                    });
                                });

                            }).catch(err => {
                                return res.status(200).send({
                                    responsecode: 400,
                                    message: err.message,
                                });
                            });

                        }).catch(err => {
                            return res.status(200).send({
                                responsecode: 400,
                                message: err.message,
                            });
                        });

                    }).catch(err => {
                        return res.status(200).send({
                            responsecode: 400,
                            message: err.message,
                        });
                    });

                }).catch(err => {
                    return res.status(200).send({
                        responsecode: 400,
                        message: err.message,
                    });
                });
            }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });
        }).catch(err => {
            return res.status(200).send({
                responsecode: 400,
                message: err.message,
            });
        });
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });

}