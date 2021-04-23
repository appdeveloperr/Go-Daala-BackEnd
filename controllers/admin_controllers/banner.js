const db = require("../../models/api_models");
const Banner = db.banner;
const fs = require('fs')

//--------Banner create Function -----------------
exports.create = function (req, res, next) {
  var fileinfo = req.file;
  console.log("this is banner Fileuploading testing : "+fileinfo);
  if (fileinfo) {//image exist
    var filename = fileinfo.filename;
    var type = req.body.type;


    var destination = "/files/uploadsFiles/";
  

    if (!type) {
      req.flash('danger', 'Selected type must needed!');
      res.redirect('/admin/banner/create');
    } else {
      Banner.create({
        banner_type: type,
        image_path: destination + "" + filename
      }).then(banner => {
        req.flash('success', 'Successfuly your banner is  Added!');
        res.redirect('/admin/banner/index');
      }).catch(err => {
        console.log(err);
      });
    }
  } else {//image is not exist
    req.flash('danger', 'Image file must upload needed!');
    res.redirect('/admin/banner/create');
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


  var fileinfo = req.file;
  if (fileinfo) {//image exist

    var filename = fileinfo.filename;
    var old_file = req.body.old_file;


    fs.unlink(old_file, function (error) {
      if (error) { console.log("err ", error) } else {
        console.log("file deleted!")
      }
    })
    var destination = "/files/uploadsFiles/";
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



//-----------------------delete bannar Function---------------------
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