const db = require("../../models/api_models");
const Contect_us = db.contect_us;


//------ get contect us page for outsider--------------------
exports.get_contect_us = function (req, res, next) {
    res.render('admin/contect_us', {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      message: ''
    });
  };
  
  //-----post contect us page for outsider--------------------
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
        message_holder:'outsider',
        vendor_id:'null',
        driver_id:'null'
        
  
  
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

  exports.payment_method = function(req,res){
    console.log('this is payment mathod');
    res.render('admin/payment');
  }