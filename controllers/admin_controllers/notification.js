const db = require("../../models/api_models");
const Trips = db.trip;
const Vendor = db.vendor;
const Driver = db.driver;
var admin = require("../../config/fcm_init").isFcm;
const notification = db.notification;


//-----admin get all FAQ'S --------------------
exports.notification_index = function (req, res) {
    notification.findAll().then(all_notification => {
      if (!all_notification) {
        console.log("no recode is exist")
      }else{
        res.render('admin/notification/index', {
          userdata: req.user,
          all_notification: all_notification
        })
      }
     
    });
  }
  
  //-----admin get create page FAQ'S --------------------
  exports.create = function (req, res) {
    res.render('admin/notification/create', {
      userdata: req.user,
      title:'',
      disc:''
    })
  };
  
  //-----admin post create FAQ'S -------------------
  exports.notification_upload = function (req, res) {
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
  
  //-----admin get edit  FAQ'S page -------------------
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
  
  //-----admin update FAQ's -------------------
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
  
  //-----admin delete FAQ's -------------------
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
  