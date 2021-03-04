const db = require("../../models/api_models");
const Driver = db.driver;
const Vehicle_reg = db.vehicle_reg;
const fs = require('fs');
const { vehicle } = require("../../models/api_models");




//--------All vendor Index Function -----------------
exports.index = function (req, res) {

  Driver.findAll().then(all_driver => {
    if (!all_driver) {
      console.log("no recode is exist")
    }
    // console.log(all_Vehicles);
    res.render('./admin/all_driver/index', {
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
    account_info: 'unblock'
  }, {
    where: {
      id: req.params.id
    }
  }).then(unblock => {
    if (unblock) {
      req.flash('success', 'Successfuly your driver is  unblock');
      res.redirect('/admin/all_driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}



//---------- Update driver account block Function ----------------------
exports.block = function (req, res, next) {


  Driver.update({
    account_info: 'block'
  }, {
    where: {
      id: req.params.id
    }
  }).then(unblock => {
    if (unblock) {
      req.flash('danger', 'Successfuly your driver is  blocked');
      res.redirect('/admin/all_driver/index');
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
      res.redirect('/admin/all_driver/index');

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
        console.log(one_vehicle)
        if (one_vehicle) {
          res.render('./admin/all_driver/information', {
            userdata: req.user,
            one_driver: one_driver,
            one_vehicle: one_vehicle
          });
        } else {
          return res.status(200).send({
            responsecode: 400,
            message: "vehicles not exists",
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
};







// //---------- Edit Vehicle Function ----------------------
// exports.edit = function (req, res) {
//   var id = req.params.id;
//   if (id) {
//     //var id = 1;
//     Vehicle.findOne({
//       where: {
//         id: id
//       }
//     }).then(edit => {
//       //if User not found with given ID
//       if (edit) {

//         res.render('admin/vehicle/edit', {
//           userdata: req.user,
//           data: edit.dataValues
//         });

//       } else {
//         console.log("if User not found with given ID");

//       }
//     }).catch(err => {
//       return res.status(200).send({
//         responsecode: 400,
//         message: err.message,
//       });
//     });
//   } else {
//     console.log('id is undifindes')
//   }
// }








