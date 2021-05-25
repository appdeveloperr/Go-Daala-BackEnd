const db = require("../../models/api_models");
const Customer = db.customer;
const Trips = db.trip;
const Address = db.address;
const fs = require('fs');
const { vehicle } = require("../../models/api_models");




//--------All customer Index Function -----------------
exports.index = function (req, res) {

    Customer.findAll().then(all_customer => {
    if (!all_customer) {
      console.log("no recode is exist")
    }
 
    res.render('./admin/customer/index', {
      userdata: req.user,
      all_customer: all_customer
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}
//----------get customer information  function------------------
exports.info= function(req,res){
  Customer.findOne({
    where: {
      id: req.params.id
    }
  }).then(one_customer => {
    if (!one_customer) {
      res.send("error of no recode is exist")
    } else {
      Trips.findAll({
        where: {
          customer_id: req.params.id
        }
      }).then(all_trips => {
        console.log(all_trips);
        res.render('./admin/customer/information', {
          userdata: req.user,
          one_customer: one_customer.dataValues,
          all_trips: all_trips
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
}
//---------- Update customer account unblock Function ----------------------
exports.unblock = function (req, res, next) {


  Customer.update({
    account_info:'unblock'
    },{
      where: {
        id: req.params.id
      }
    }).then(unblock => {
      if (unblock) {
        req.flash('success', 'Successfuly your customer is  unblock');
        res.redirect('/admin/customer/index');
      }
    }).catch(err => {
      console.log(err);
    });
}



//---------- Update customer account block Function ----------------------
exports.block = function (req, res, next) {


  Customer.update({
    account_info:'block'
    },{
      where: {
        id: req.params.id
      }
    }).then(block => {
      if (block) {
        req.flash('danger', 'Successfuly your customer is  blocked');
        res.redirect('/admin/customer/index');
      }
    }).catch(err => {
      console.log(err);
    });
}


//-----------------------delete customer Function---------------------
exports.delete = function (req, res) {

  Customer.findOne({
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
    Customer.destroy({
      where: {
        id: req.params.id
      }
    }).then(customer => {

      if (!customer) {
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
        customer_id: req.params.id
      }
    }).then(customer => {

      req.flash('success', 'Successfuly your customer is  Deleted!');
    res.redirect('/admin/customer/index');
    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    });

}


