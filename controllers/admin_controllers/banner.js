const db = require("../../models/api_models");
const Banner = db.banner;
const fs = require('fs')

//--------Banner create Function -----------------
exports.create = function (req, res, next) {
  if (!req.body.type) {
    req.flash('danger', 'Selected type must needed!');
    res.redirect('/admin/banner/create');
  } else {
    if (!req.files) {
      req.flash('danger', 'Banner Image file must needed!');
      res.redirect('/admin/banner/create');
    } else {
      req.checkBody('myFile', 'Bannar picture must have needed! with anImage').isImage(req.files.myFile.name);
      var errors = req.validationErrors();

      if (errors) {   //////////------input file must have image validation error
        res.render('admin/banner/create', {
          errors: errors,
        });
      } else {   ///------------------ no error exist
        var path_file = './public/files/uploadsFiles/';
        var filename = 'Banner-1' + Date.now() + req.files.myFile.name;
        req.files.myFile.mv(path_file + '' + filename, function (err) {
          if (err) console.log("error occured");
        });
        Banner.create({
          banner_type: req.body.type,
          image_path: "/files/uploadsFiles/" + filename
        }).then(banner => {
          req.flash('success', 'Successfuly your banner is  Added!');
          res.redirect('/admin/banner/index');
        }).catch(err => {
          console.log(err);
        });
      }

    }
  }

}


//--------Banner Index Function -----------------
exports.index = function (req, res) {

  Banner.findAll().then(all_banners => {
    if (!all_banners) {
      console.log("no recode is exist")
    }
    res.render('./admin/banner/index', {
      userdata: req.user,
      all_banners: all_banners
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}




//---------- Edit Banner Function ----------------------
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
        status: 400,
        message: err.message,
      });
    });
  } else {
    console.log('id is undifindes')
  }
}




//---------- Update Banner Function ----------------------
exports.update = function (req, res, next) {

  req.checkBody('type', 'Selected type must have needed!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/banner/edit', {
      errors: errors,
      data: req.body.data
    });
  } else {
    if (!req.files) {
      Banner.update({
        banner_type: req.body.type
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

    } else {
      var path_file = './public/files/uploadsFiles/';
      var filename = 'Banner-1' + Date.now() + req.files.myFile.name;
      req.files.myFile.mv(path_file + '' + filename, function (err) {
        if (err) console.log("error occured");
      });

      fs.unlink('./public' + req.body.old_file, function (error) {
        if (error) { console.log("err ", error) } else {
          console.log("file deleted!")
        }
      });

      Banner.update({
        banner_type: req.body.type,
        image_path: "/files/uploadsFiles/" + filename
      }, {
        where: {
          id: req.body.id
        }
      }).then(banner => {
        if (banner) {
          req.flash('success', 'Successfuly your banner is updated!');
          res.redirect('/admin/banner/index');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
}



//-----------------------delete bannar Function---------------------
exports.delete = (req, res) => {

  var id = req.params.id;
  //var id = 1;
  Banner.findOne({
    where: {
      id: id
    }
  }).then(Delete => {

    fs.unlink('./public' + Delete.dataValues.image_path, function (error) {
      if (error) { console.log("err ", error) } else {
        console.log("file deleted!")
      }
    });

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
    });


  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  })


}