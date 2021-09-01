const db = require("../../models/api_models");

const Driver = db.driver;
const Vendor = db.vendor;
const Vehicle_reg = db.vehicle_reg;
const Trip = db.trip;
const Vehicle = db.vehicle
const Op = db.Sequelize.Op;

const fs = require('fs');
const { vehicle } = require("../../models/api_models");
const { app } = require("firebase-admin");
// const { title } = require("process");



//--------All Drivers Index Function -----------------
exports.index = function (req, res) {

  Driver.findAll().then(all_driver => {
    if (!all_driver) {
      console.log("no recode is exist")
    }



    res.render('./admin/driver/index', {
      userdata: req.user,
      all_driver: all_driver,
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}
//--------All Register Drivers Index Function -----------------
exports.register_drivers = function (req, res) {
  Driver.findAll({
    where: {
      account_info: 'unblock'
    }
  }).then(all_driver => {
    if (!all_driver) {
      console.log("no recode is exist")
    }
    // console.log(all_Vehicles);
    res.render('./admin/driver/index', {
      userdata: req.user,
      all_driver: all_driver
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}
//--------All Driver unregisters Index Function -----------------
exports.unregister_drivers = function (req, res) {
  Driver.findAll({
    where: {
      account_info: 'block'
    }
  }).then(all_driver => {
    if (!all_driver) {
      console.log("no recode is exist")
    }
    // console.log(all_Vehicles);
    res.render('./admin/driver/index', {
      userdata: req.user,
      all_driver: all_driver
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}

//--------All Driver unregisters Index Function -----------------
exports.active_drivers = function (req, res) {
  Driver.findAll({
    where: {
      account_info: 'unblock',
      status: 'active'
    }
  }).then(all_driver => {
    if (!all_driver) {
      console.log("no recode is exist")
    }
    // console.log(all_Vehicles);
    res.render('./admin/driver/index', {
      userdata: req.user,
      all_driver: all_driver
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}
//---------- Update driver account unblock Function ----------------------
exports.unblock = function (req, res, next) {


  Driver.update({
    account_info: 'unblock'  }, {
    where: {
      id: req.params.id
    }
  }).then(unblock => {
    if (unblock) {
      req.flash('success', 'Successfuly your driver is  unblock');
      res.redirect('/admin/driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}



//---------- Update driver account block Function ----------------------
exports.block = function (req, res, next) {


  Driver.update({
    account_info: 'block',
    status: "unactive"
  }, {
    where: {
      id: req.params.id
    }
  }).then(unblock => {
    if (unblock) {
      req.flash('danger', 'Successfuly your driver is  blocked');
      res.redirect('/admin/driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}


//-----------------------delete driver Function---------------------
exports.delete = function (req, res) {

  Driver.findOne({
    where: {
      id: req.params.id
    }
  }).then(Delete => {
    //if User not found with given ID
    if (Delete) {
      fs.unlink(Delete.dataValues.profile, function (error) {
        if (error) { console.log("err ", error) } else {
          console.log("file profile deleted!")
        }
      });

      fs.unlink(Delete.dataValues.cnic, function (error) {
        if (error) { console.log("err ", error) } else {
          console.log("file cnic deleted!")
        }
      });

      fs.unlink(Delete.dataValues.driving_license, function (error) {
        if (error) { console.log("err ", error) } else {
          console.log("file driving_license deleted!")
        }
      });

    } else {
      console.log("if User not found with given ID");
    }
  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  }),
    Driver.destroy({
      where: {
        id: req.params.id
      }
    }).then(vehicle => {

      if (!vehicle) {
        return res.status(200).send({
          responsecode: 400,
          message: "Contacts not found",
        });
      }

      req.flash('success', 'Successfuly your Driver is  Deleted!');
      res.redirect('/admin/driver/index');

    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    });

}



//-------- driver and his vehicle information admin side -----------------
exports.information = function (req, res, next) {
  Driver.findOne({
    where: {
      id: req.params.id
    }
  }).then(one_driver => {
    if (!one_driver) {
      res.send("error of no recode is exist")
    } else {
      Vehicle_reg.findOne({
        where: {
          driver_id: req.params.id
        }
      }).then(one_vehicle => {
        res.render('./admin/driver/information', {
          userdata: req.user,
          one_drivers: one_driver.dataValues,
          one_vehicle: one_vehicle
        });

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
};



//---------- Update vehicle account active Function ----------------------
exports.active = function (req, res, next) {


  Vehicle_reg.update({
    status: 'active'
  }, {
    where: {
      id: req.params.id
    }
  }).then(unactive => {
    if (unactive) {
      req.flash('success', 'Successfuly your driver vehicle is  active');
      res.redirect('/admin/driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}



//---------- Update driver account block Function ----------------------
exports.unactive = function (req, res, next) {


  Vehicle_reg.update({
    status: 'unactive'
  }, {
    where: {
      id: req.params.id
    }
  }).then(active => {
    if (active) {
      req.flash('danger', 'Successfuly your driver vehicle is  unactive');
      res.redirect('/admin/driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}


//--------------driver recent  all trip---------------
exports.recent_trip = (req, res) => {
Driver.findOne({where:{
  id:req.params.id
}}).then(driver_info=>{
    Trip.findAll({
      where: {
        driver_id: req.params.id
      },
      include: [
        {
          model: db.vendor
        },
        {
          model: db.customer
        }
      ]
    }).then(trip => {
      Vehicle_reg.findOne({
        where: {
          driver_id: req.params.id
        }
      }).then(driver_vehicles => {
        if(driver_vehicles!=null){
          Vehicle.findOne({where:{vehicle_type:driver_vehicles.dataValues.vehicle_type}}).then(company_commission=>{
            console.log(company_commission.dataValues.company_commission)
            res.render('./admin/trip/driver_trip', {
              driver_trip:trip,
              driver_information:driver_info,
              driver_vehicle:company_commission.dataValues.company_commission
    
            });
  
          })
        }else{
          res.render('./admin/trip/driver_trip', {
            driver_trip:trip,
            driver_information:driver_info,
            driver_vehicle:0
  
          });
        }
      
      
      })
     
  });

}).catch(err => {
  console.log(err);
});
}


exports.add_commission=async(req,res)=>{
const commission =  parseInt(req.body.add_commission) + parseInt(req.body.old_paid_commission);
  Driver.update({
    paid_company_commission: commission
  }, {
    where: {
      id: req.body.id
    }
  }).then(paid_commission => {
    if (paid_commission) {
      req.flash('success', 'Successfuly your add Company Commission');
      res.redirect('/driver/all_trips/'+req.body.id);
    }
  }).catch(err => {
    console.log(err);
  });
}


exports.chat = function (req, res, next) {
  res.render('index');
}













