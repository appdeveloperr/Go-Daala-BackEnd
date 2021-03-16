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


