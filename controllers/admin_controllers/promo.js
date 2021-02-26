const db = require("../../models/api_models");
const Promo = db.promo;


//---------- Get Promo Function ----------
 



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
      code:req.body.code,
      type:req.body.type,
      discount:req.body.discount
		});
	} else {
  console.log("no validation error");
  }
  // var fileinfo = req.file;
  // if (fileinfo) {//image exist
  //   var filename = fileinfo.filename;
  //   var type = req.body.type;


  //   var destination = fileinfo.destination

  //   if (!type) {
  //     req.flash('danger', 'Selected type must needed!');
  //     res.redirect('/admin/banner/create');
  //   } else {
  //     Banner.create({
  //       banner_type: type,
  //       image_path: destination + "" + filename
  //     }).then(banner => {
  //       req.flash('success', 'Successfuly your banner is  Added!');
  //       res.redirect('/admin/banner/index');
  //     }).catch(err => {
  //       console.log(err);
  //     });
  //   }
  // } else {//image is not exist
  //   req.flash('danger', 'Image file must upload needed!');
  //   res.redirect('/admin/banner/create');
  // }
}


//--------Promo Index Function -----------------
exports.index = function (req, res) {

//   Promo.findAll().then(all_banners => {
//     if (!all_banners) {
//       console.log("no recode is exist")
//     }
    res.render('./admin/promo/index', {
      userdata: req.user
      
    });

//   }).catch(err => {
//     return res.status(200).send({
//       responsecode: 400,
//       message: err.message,
//     });
//   });
}




//---------- Edit Promo Function ----------------------
exports.edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    //var id = 1;
    Banner.findOne({
      where: {
        id: id
      }
    }).then(edit => {
      //if User not found with given ID
      if (edit) {

        res.render('admin/banner/edit', {
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




//---------- Update Promo Function ----------------------
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
    Banner.update({
      banner_type: req.body.type,
      image_path: destination + "" + filename
    }, {
      where: {
        id: req.body.id
      }
    }).then(banner => {
      if (banner) {
        req.flash('success', 'Successfuly your banner is  Added!');
        res.redirect('/admin/banner/index');
      }
    }).catch(err => {
      console.log(err);
    });

  } else {//image is not exist


    console.log(req.body.type);
    Banner.update({
      banner_type: req.body.type
    }, {
      where: {
        id: req.body.id
      },
      order: [
        'id', 'DESC',
      ],
    }).then(banner => {
      if (banner) {
        req.flash('success', 'Successfuly your banner is  Added!');
        res.redirect('/admin/banner/index');
      }
    }).catch(err => {
      console.log(err);
    });

    // req.flash('danger', 'Image file must upload needed!');
    res.redirect('/admin/banner/index');
  }
}



//-----------------------delete Promo Function---------------------
exports.delete = function (req, res) {

  Banner.findOne({
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
    Banner.destroy({
      where: {
         id: req.params.id
      }
    }).then(banner => {

      if (!banner) {
          return res.status(200).send({
              responsecode: 400,
              message: "Contacts not found",
          });
      }
         
      req.flash('success', 'Successfuly your banner is  Deleted!');
      res.redirect('/admin/banner/index');

    }).catch(err => {
      return res.status(200).send({
          responsecode: 400,
          message: err.message,
      });
    }));

  }