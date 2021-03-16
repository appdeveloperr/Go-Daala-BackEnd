const db = require("../../models/api_models");
const Vehicle = db.vehicle;
const fs = require('fs');
const { vehicle } = require("../../models/api_models");

//--------Vehicle create Function -----------------
exports.create = function (req, res, next) {
  var fileinfo = req.file;
  if (fileinfo) {//image exist
    var filename = fileinfo.filename;
    var type = req.body.type;


    var destination = fileinfo.destination

    if (!type) {
      req.flash('danger', 'input type must needed!');
      res.redirect('/admin/vehicle/create');
    } else {
      Vehicle.create({
        vehicle_type: type,
        image_path: destination + "" + filename
      }).then(vehicle => {
        req.flash('success', 'Successfuly your vehicle is  Added!');
        res.redirect('/admin/vehicle/index');
      }).catch(err => {
        console.log(err);
      });
    }
  } else {//image is not exist
    req.flash('danger', 'Image file must upload needed!');
    res.redirect('/admin/vehicle/create');
  }
}


//--------Vehicle Index Function -----------------
exports.index = function (req, res) {

  Vehicle.findAll().then(all_Vehicles => {
    if (!all_Vehicles) {
      console.log("no recode is exist")
    }
    res.render('./admin/vehicle/index', {
      userdata: req.user,
      all_Vehicles: all_Vehicles
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}

//---------- Edit Vehicle Function ----------------------
exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    //var id = 1;
    Vehicle.findOne({
      where: {
        id: id
      }
    }).then(edit => {
      //if User not found with given ID
      if (edit) {

        res.render('admin/vehicle/edit', {
          userdata: req.user,
          data: edit.dataValues
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


//---------- Update Vehicle Function ----------------------
exports.update = function (req, res, next) {


  var fileinfo = req.file;
  if (fileinfo) {//image exist

    var filename = fileinfo.filename;
    var old_file = req.body.old_file;


    fs.unlink(old_file, function (error) {
      if (error) { console.log("err ", error) } else {
        console.log("file deleted!")
      }
    })
    var destination = fileinfo.destination
    Vehicle.update({
      vehicle_type: req.body.type,
      image_path: destination + "" + filename
    }, {
      where: {
        id: req.body.id
      }
    }).then(vehicle => {
      if (vehicle) {
        req.flash('success', 'Successfuly your Vehicle is  Added!');
        res.redirect('/admin/vehicle/index');
      }
    }).catch(err => {
      console.log(err);
    });

  } else {//image is not exist


    console.log(req.body.type);
    Vehicle.update({
      banner_type: req.body.type
    }, {
      where: {
        id: req.body.id
      },
      order: [
        'id', 'DESC',
      ],
    }).then(vehicle => {
      if (vehicle) {
        req.flash('success', 'Successfuly your Vehicle is  Added!');
        res.redirect('/admin/vehicle/index');
      }
    }).catch(err => {
      console.log(err);
    });

    // req.flash('danger', 'Image file must upload needed!');
    res.redirect('/admin/vehicle/index');
  }
}



//-----------------------delete Vehicle Function---------------------
exports.delete = function (req, res) {

  Vehicle.findOne({
    where: {
      id: req.params.id
    }
  }).then(Delete => {
    //if User not found with given ID
    if (Delete) {
      fs.unlink(Delete.dataValues.image_path, function (error) {
        if (error) { console.log("err ", error) } else {
          console.log("file deleted!")
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
  },
    Vehicle.destroy({
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

      req.flash('success', 'Successfuly your vehicle is  Deleted!');
      res.redirect('/admin/vehicle/index');

    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    }));

}