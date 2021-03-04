const db = require("../../models/api_models");
const Vendor = db.vendor;
const Address = db.address;
const fs = require('fs');
const { vehicle } = require("../../models/api_models");




//--------All vendor Index Function -----------------
exports.index = function (req, res) {

    Vendor.findAll().then(all_vendor => {
    if (!all_vendor) {
      console.log("no recode is exist")
    }
 
    res.render('./admin/all_vendor/index', {
      userdata: req.user,
      all_vendor: all_vendor
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}

//---------- Update Vendor account unblock Function ----------------------
exports.unblock = function (req, res, next) {


  Vendor.update({
    account_info:'unblock'
    },{
      where: {
        id: req.params.id
      }
    }).then(unblock => {
      if (unblock) {
        req.flash('success', 'Successfuly your Vendor is  unblock');
        res.redirect('/admin/all_vendor/index');
      }
    }).catch(err => {
      console.log(err);
    });
}



//---------- Update Vendor account block Function ----------------------
exports.block = function (req, res, next) {


  Vendor.update({
    account_info:'block'
    },{
      where: {
        id: req.params.id
      }
    }).then(block => {
      if (block) {
        req.flash('danger', 'Successfuly your Vendor is  blocked');
        res.redirect('/admin/all_vendor/index');
      }
    }).catch(err => {
      console.log(err);
    });
}


//-----------------------delete Vendor Function---------------------
exports.delete = function (req, res) {

  Vendor.findOne({
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

    } else {
      console.log("if User not found with given ID");
    }
  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  }),
    Vendor.destroy({
      where: {
        id: req.params.id
      }
    }).then(vendor => {

      if (!vendor) {
        return res.status(200).send({
          responsecode: 400,
          message: "Contacts not found",
        });
      }
    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    }),
    Address.destroy({
      where: {
        vendor_id: req.params.id
      }
    }).then(vendor => {

      req.flash('success', 'Successfuly your Vendor is  Deleted!');
    res.redirect('/admin/all_vendor/index');
    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    });

}


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




// //---------- Update Vehicle Function ----------------------
// exports.update = function (req, res, next) {


//   var fileinfo = req.file;
//   if (fileinfo) {//image exist

//     var filename = fileinfo.filename;
//     var old_file = req.body.old_file;


//     fs.unlink(old_file, function (error) {
//       if (error) { console.log("err ", error) } else {
//         console.log("file deleted!")
//       }
//     })
//     var destination = fileinfo.destination
//     Vehicle.update({
//       vehicle_type: req.body.type,
//       image_path: destination + "" + filename
//     }, {
//       where: {
//         id: req.body.id
//       }
//     }).then(vehicle => {
//       if (vehicle) {
//         req.flash('success', 'Successfuly your Vehicle is  Added!');
//         res.redirect('/admin/vehicle/index');
//       }
//     }).catch(err => {
//       console.log(err);
//     });

//   } else {//image is not exist


//     console.log(req.body.type);
//     Vehicle.update({
//       banner_type: req.body.type
//     }, {
//       where: {
//         id: req.body.id
//       },
//       order: [
//         'id', 'DESC',
//       ],
//     }).then(vehicle => {
//       if (vehicle) {
//         req.flash('success', 'Successfuly your Vehicle is  Added!');
//         res.redirect('/admin/vehicle/index');
//       }
//     }).catch(err => {
//       console.log(err);
//     });

//     // req.flash('danger', 'Image file must upload needed!');
//     res.redirect('/admin/vehicle/index');
//   }
// }



// //-----------------------delete Vehicle Function---------------------
// exports.delete = function (req, res) {

//   Vehicle.findOne({
//     where: {
//       id: req.params.id
//     }
//   }).then(Delete => {
//     //if User not found with given ID
//     if (Delete) {
//       fs.unlink(Delete.dataValues.image_path, function (error) {
//         if (error) { console.log("err ", error) } else {
//           console.log("file deleted!")
//         }
//       });
//     } else {
//       console.log("if User not found with given ID");
//     }
//   }).catch(err => {
//     return res.status(200).send({
//       responsecode: 400,
//       message: err.message,
//     });
//   },
//     Vehicle.destroy({
//       where: {
//         id: req.params.id
//       }
//     }).then(vehicle => {

//       if (!vehicle) {
//         return res.status(200).send({
//           responsecode: 400,
//           message: "Contacts not found",
//         });
//       }

//       req.flash('success', 'Successfuly your vehicle is  Deleted!');
//       res.redirect('/admin/vehicle/index');

//     }).catch(err => {
//       return res.status(200).send({
//         responsecode: 400,
//         message: err.message,
//       });
//     }));

// }