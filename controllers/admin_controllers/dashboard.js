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



exports.Dishboard = async (req, res) => {
    try {
        const banner =await Banner.findAndCountAll();

    const promo = await Promo.findAndCountAll();

    const vehicle =await  Vehicle.findAndCountAll();

    const booking = await Booking.findAndCountAll();

    const vendor = await Vendor.findAndCountAll();

    const driver =await Driver.findAndCountAll();

    const customer =await Customer.findAndCountAll();

    const help_and_supports =await help_and_support.findAndCountAll();

    const faq = await FAQS.findAndCountAll();


    res.render('admin/index', {
        Banner: banner.count,
        Promo: promo.count,
        Vehicle: vehicle.count,
        Booking: booking.count,
        Vendor: vendor.count,
        Customer: customer.count,
        Driver: driver.count,
        help_and_support: help_and_supports.count,
        FAQS: faq.count
    });
    } catch (error) {
        return res.status(200).send({
            responsecode: 400,
            message: error.message,
        });
    }
    
}