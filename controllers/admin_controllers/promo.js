const db = require("../../models/api_models");
const Promo = db.promo;




//--------Promo Index Function -----------------
exports.index = function (req, res) {

  Promo.findAll().then(all_promos => {
    if (!all_promos) {
      console.log("no recode is exist")
    }
    res.render('./admin/promo/index', {
      userdata: req.user,
      all_promos: all_promos

    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}


//--------Promo create Function -----------------
exports.create = function (req, res) {

  req.checkBody('code', 'Code must have value!').notEmpty();
  req.checkBody('type', 'type must have selected needed!').notEmpty();
  req.checkBody('discount', 'Discount must have value!').notEmpty();


  var errors = req.validationErrors();
  if (errors) {
    res.render('./admin/promo/create', {
      errors: errors,
      userdata: req.user,
      code: req.body.code,
      type: req.body.type,
      discount: req.body.discount
    });
  } else {
    var publish = "UnPublish";
    if (req.body.publish) {
      Promo.create({
        code: req.body.code,
        type: req.body.type,
        discount: req.body.discount,
        publish: req.body.publish
      }).then(banner => {
        req.flash('success', 'Successfuly your promo is  Added!');
        res.redirect('/admin/promo/index');
      }).catch(err => {
        return res.status(200).send({
          responsecode: 400,
          message: err.message,
        });
      });
    } else {
      Promo.create({
        code: req.body.code,
        type: req.body.type,
        discount: req.body.discount,
        publish: "unpublish"
      }).then(banner => {
        req.flash('success', 'Successfuly your promo is  Added!');
        res.redirect('/admin/promo/index');
      }).catch(err => {
        return res.status(200).send({
          responsecode: 400,
          message: err.message,
        });
      });
    }

  }

}


//---------- Edit Promo Function ----------------------
exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    //var id = 1;
    Promo.findOne({
      where: {
        id: id
      }
    }).then(edit => {
      //if User not found with given ID
      if (edit) {

        res.render('admin/promo/edit', {
          userdata: req.user,
          id: edit.id,
          code: edit.code,
          type: edit.type,
          discount: edit.discount,
          publish: edit.publish
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




//---------- Update Promo Function ----------------------
exports.update = function (req, res, next) {

  req.checkBody('code', 'Code must have value!').notEmpty();
  req.checkBody('type', 'type must have selected needed!').notEmpty();
  req.checkBody('discount', 'Discount must have value!').notEmpty();


  var errors = req.validationErrors();
  if (errors) {
    res.render('./admin/promo/edit', {
      errors: errors,
      userdata: req.user,
      id: req.body.id,
      code: req.body.code,
      type: req.body.type,
      discount: req.body.discount,
      publish: req.body.publish
    });
  } else {
    if (req.body.publish) {
      Promo.update({
        code: req.body.code,
        type: req.body.type,
        discount: req.body.discount,
        publish: req.body.publish
      }, {
        where: {
          id: req.body.id
        }
      }).then(promo => {
        req.flash('success', 'Successfuly your promo is  Added!');
        res.redirect('/admin/promo/index');
      }).catch(err => {
        return res.status(200).send({
          responsecode: 400,
          message: err.message,
        });
      });
    } else {
      Promo.update({
        code: req.body.code,
        type: req.body.type,
        discount: req.body.discount,
        publish: "unpublish"

      }, {
        where: {
          id: req.body.id
        }
      }).then(banner => {
        req.flash('success', 'Successfuly your promo is  Added!');
        res.redirect('/admin/promo/index');
      }).catch(err => {
        return res.status(200).send({
          responsecode: 400,
          message: err.message,
        });
      });
    }

  }
}


//-----------------------delete Promo Function---------------------
exports.delete = function (req, res) {
  Promo.destroy({
    where: {
      id: req.params.id
    }
  }).then(promo => {

    if (!promo) {
      return res.status(200).send({
        responsecode: 400,
        message: "Contacts not found",
      });
    }

    req.flash('success', 'Successfuly your Promo is  Deleted!');
    res.redirect('/admin/promo/index');

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });

}