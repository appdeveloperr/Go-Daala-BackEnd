const db = require("../../models/api_models");
const Driver = db.driver;
const Vehicle_reg = db.vehicle_reg;
const Trip = db.trip;
const Contect_us = db.contect_us;
const Faqs = db.faqs;
const fs = require('fs');
const { vehicle } = require("../../models/api_models");
const { app } = require("firebase-admin");
const { title } = require("process");



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
    account_info: 'unblock',
    status: "unactive"
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
    account_info: 'block',
    status: "unactive"
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
        res.render('./admin/all_driver/information', {
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
      res.redirect('/admin/all_driver/index');
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
      res.redirect('/admin/all_driver/index');
    }
  }).catch(err => {
    console.log(err);
  });
}


//--------------driver recent  all trip---------------
exports.recent_trip = (req, res) => {
  // Save vendor to Database
  Trip.findAll({
    where: {
      driver_id: req.params.id
    }
  }).then(trip => {
    res.render('admin/trip/driver_trip', {
      userdata: req.user,
      driver_trip: trip
    });

  }).catch(err => {

    return res.status(200).send({
      status: 400,
      message: err.message,
      successData: {}
    });

  });

}





exports.chat = function (req, res, next) {
  res.render('index');
}

exports.get_contect_us = function (req, res, next) {
  res.render('admin/contect_us', {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: ''
  });
};

exports.create = function (req, res, next) {
  req.checkBody('first_name', 'First Name must have value!').notEmpty();
  req.checkBody('last_name', 'Last Name must have value!').notEmpty();
  req.checkBody('email', 'Email must have value!').notEmpty();
  req.checkBody('phone', 'Phone Number must have value!').notEmpty();
  req.checkBody('message', 'Message must have value!').notEmpty();


  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/contect_us', {
      errors: errors,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    });
  } else {
    Contect_us.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      message_holder:'outsider'


    }).then(contect => {
      if (contect) {
        req.flash('success', 'Successfuly your massage  is  send');
        res.render('admin/contect_us', {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          message: ''
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
};

exports.faqs_index = function (req, res) {
  Faqs.findAll().then(all_faqs => {
    if (!all_faqs) {
      console.log("no recode is exist")
    }
    res.render('admin/faqs/index', {
      userdata: req.user,
      all_faq_s: all_faqs
    })
  });
}

exports.faqs_create = function (req, res) {
  res.render('admin/faqs/create', {
    userdata: req.user,
    title:'',
    disc:''
  })
};

exports.faqs_upload = function (req, res) {
  req.checkBody('title', 'Title must have needed!').notEmpty();
  req.checkBody('disc', 'Discreption must have needed!').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/faqs/create', {
      errors: errors,
      userdata: req.user,
      title: req.body.title,
      disc: req.body.disc
    });
  } else {
    Faqs.create({
      title: req.body.title,
      disc: req.body.disc
    }).then(faqs => {
      if (faqs) {
        req.flash('success', 'Successfuly your faqs  is  created');
        res.redirect('/admin/faqs/index');
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


exports.faqs_edit = function (req,res){
var id=req.params.id;
if (id) {
  //var id = 1;
  Faqs.findOne({
    where: {
      id: id
    }
  }).then(edit => {
    //if User not found with given ID
    if (edit) {
      res.render('admin/faqs/edit', {
        userdata: req.user,
        id: edit.dataValues.id,
        title: edit.dataValues.title,
        disc: edit.dataValues.disc
      });

    } else {
      console.log("if User not found with given ID");

    }
  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
} else {
  console.log('id is undifindes')
}
}


exports.faqs_update=function(req,res){
  Faqs.update({
    title:req.body.title,
    disc:req.body.disc
},
    {
        where: { id: req.body.id },
        returning: true,
        plain: true
    },
).then(faqs => {

    if (faqs) {
      req.flash('success', 'Successfuly your faqs  is  updated');
      res.redirect('/admin/faqs/index');
     
    }
}).catch(err => {
    return res.status(200).send({
        status: 400,
        message: err.message,
        successData: {}
    });


});
}
exports.faqs_delete=function(req,res){
  Faqs.destroy({
    where: {
      id: req.params.id
    }
  }).then(faqs => {

    if (!faqs) {
      return res.status(200).send({
        responsecode: 400,
        message: "Contacts not found",
      });
    }else{
      req.flash('success', 'Successfuly your faqs  is  Deleted');
      res.redirect('/admin/faqs/index');
    }
  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  })}









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








