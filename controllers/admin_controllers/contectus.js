const db = require("../../models/api_models");
const Contect_us = db.contect_us;
const axios = require('axios');


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
    var payload = {
      "pp_Version": "1.1",
      "pp_TxnType": "MWALLET",
      "pp_Language": "EN",
      "pp_MerchantID": "MC18517",
      "pp_SubMerchantID": "",
      "pp_Password": "null",
      "pp_BankID": "",
      "pp_ProductID": "",
      "pp_TxnRefNo": "T20210503152949",
      "pp_Amount": "100",
      "pp_TxnCurrency": "PKR",
      "pp_TxnDateTime": "20210503153001",
      "pp_BillReference": "billRef",
      "pp_Description": "Description",
      "pp_TxnExpiryDateTime": "20210504153001",
      "pp_ReturnURL": "",
      "pp_SecureHash": "954E87BF208E7C6DC2694D61BB9743D52AA7E1F0094CBEFE3B77B6E668CEF543",
      "ppmpf_1": "03416409993",
      "ppmpf_2": "",
      "ppmpf_3": "",
      "ppmpf_4": "",
      "ppmpf_5": ""
  };

    
    axios.get('https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction',payload)
    .then(response => { 
      console.log('this is response: '+response);
    })
    .catch(error => {
        return res.status(200).send({
            status: 400,
            message: error
        });
    });
    console.log('this is payment mathod');
    // res.render('admin/payment');
  }