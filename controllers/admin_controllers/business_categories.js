const db = require("../../models/api_models");
const Business_categories = db.business_categories;


//-------- create Service Function -----------------
exports.add = (req, res) => {
  if (req.body.name != null || req.body.name != '') {
    Business_categories.create({
          name: req.body.name,
        }).then(business_categories => {
          req.flash('success', 'Successfuly your Business Category Name is  Added!');
          res.redirect('/admin/business_categories/index');
        }).catch(err => {
          console.log(err);
        });



  } else {
    req.flash('danger', 'please provide Business name!');
    res.redirect('/admin/business_categories/index');
  }
}


//--------Service Index Function -----------------
exports.index = (req, res) => {
  Business_categories.findAll().then(all_business_categories => {
    
        res.render('./admin/business_categories/index', {
          all_business_categories: all_business_categories
        });
     
  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}

exports.update = (req, res) => {
  if (req.body.name != null || req.body.name != '') {
  Business_categories.update({
        name: req.body.name
      }, {
        where: {
          id: req.body.id
        }
      }).then(business_categories => {
        if (business_categories) {
          req.flash('success', 'Successfuly your Business categories name is Updated!');
          res.redirect('/admin/business_categories/index');
        }
      }).catch(err => {
        console.log(err);
      });
  }else{
    req.flash('danger', 'please provide Business name!');
    res.redirect('/admin/business_categories/index');
  }
}

exports.delete = (req, res) => {
  Business_categories.destroy({
      where: {
        id: req.params.id
      }
    }).then(business_categories => {

      if (!business_categories) {
        return res.status(200).send({
          responsecode: 400,
          message: "business_categories not found",
        });
      }

      req.flash('success', 'Successfuly your business_categories name is  Deleted!');
      res.redirect('/admin/business_categories/index');

    }).catch(err => {
      return res.status(200).send({
        responsecode: 400,
        message: err.message,
      });
    });
}

exports.api_get_business_categories =(req,res)=>{
  Business_categories.findAll().then(all_business_categories => {
    
      return res.status(200).send({
      status: 200,
      message: 'get all_business_categories successful retrived',
      successData:{
        all_business_categories:all_business_categories
      }
    });
     
  }).catch(err => {
    return res.status(200).send({
      status: 400,
      message: 'error in api_get all business categories '+err,
      successData:{
        
      }
    });
  });
}