const db = require("../../models/api_models");
const Trips = db.trip;

//--------Booking Ongoing Function -----------------
exports.ongoing = function (req, res) {

    Trips.findAll({
        where:{
            status:{
            [Op.or]: ['wait','start']
            }
        }
    },{
        include: [
            {
                model: db.driver
            },
            {
                model: db.vendor
            },
            {
                model: db.customer
            }
        ]
    }).then(all_trip => {
        if (!all_trip) {
            console.log("no trips  recode is exist")
        } else {


            res.render('./admin/booking/index', {
                all_trips: all_trip,
                state:"start"
            })

        }
    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
}


//--------Booking Index Function -----------------
exports.index = function (req, res) {

    Trips.findAll({
        include: [
            {
                model: db.driver
            },
            {
                model: db.vendor
            },
            {
                model: db.customer
            }
        ]
    }).then(all_trip => {
        if (!all_trip) {
            console.log("no trips  recode is exist")
        } else {


            res.render('./admin/booking/index', {
                all_trips: all_trip,
                state:"all"
            })

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

    Trips.findAll({
        where:{
            status:'end'
        }
    },{
        include: [
            {
                model: db.driver
            },
            {
                model: db.vendor
            },
            {
                model: db.customer
            }
        ]
    }).then(all_trip => {
        if (!all_trip) {
            console.log("no trips  recode is exist")
        } else {


            res.render('./admin/booking/index', {
                all_trips: all_trip,
                state:"end"
            })

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
    Trips.findAll({where:{
        status:'cancel'
    }},{
        include: [
            {
                model: db.driver
            },
            {
                model: db.vendor
            },
            {
                model: db.customer
            }
        ]
    }).then(all_trip => {
        if (!all_trip) {
            console.log("no trips  recode is exist")
        } else {


            res.render('./admin/booking/cancel', {
                all_trips: all_trip,
                state:"cancel"
            })

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
