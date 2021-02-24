const db = require("../../models/api_models");
const Banner = db.banner;
exports.create = function (req, res, next) {
  var fileinfo = req.file;
  if (fileinfo) {//image exist
    var filename = fileinfo.filename;
    var type = req.body.type;
    var destination = fileinfo.destination

    if (!type) {
      req.flash('danger', 'Selected type must needed!');
      res.redirect('/admin/banner/create');
    } else {
      Banner.create({
        banner_type: type,
        image_path: destination+""+filename
      }).then(banner => {
        req.flash('success', 'Successfuly your banner is  Added!');
        res.redirect('/admin/banner/create');
      }).catch(err => {
        console.log(err);
      });
    }
  } else {//image is not exist
    req.flash('danger', 'Image file must upload needed!');
    res.redirect('/admin/banner/create');
  }
}
exports.index = function (req, res) {

  Banner.findAll().then(all_banners => {
    if (!all_banners) {
      console.log("no recode is exist")
    }
    res.render('./admin/banner/index',{
      userdata: req.user,
      all_banners:all_banners
    });

  }).catch(err => {
    return res.status(200).send({
      responsecode: 400,
      message: err.message,
    });
  });
}

exports.edit = function (req,res){
  var id = req.params.id;
  Banner.findOne({
      WHERE:{id : id}
  }).then(Edit=>{
    if(!Edit){
      console.log("this id is does not exist!");
    }else{ 
   
      res.render('./admin/banner/edit',{
        userdata: req.user,
        data : Edit.dataValues
      });

    }
  }).catch(err => {
                return res.status(200).send({
                    responsecode: 400,
                    message: err.message,
                });
            });
}