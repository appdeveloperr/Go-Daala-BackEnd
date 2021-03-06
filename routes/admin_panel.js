var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// const multer = require('multer');
const path = require('path');

var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });


/*
 	Get pages index
*/
router.use(bodyParser.json());
//router.use(express.urlencoded());


router.get('/test', function (req, res) {
	console.log('test');
	//res.redirect('/adminnews');

});

router.get('/', function (req, res) {
	res.render('admin/index');
});
/*
 	Get add news
*/
router.get('/addnews', function (req, res) {

	var date = new Date();
	var errorsType = "";
	var msg = "";
	Category.find({}).exec(function (err, category) {
		Pages.find({}).exec(function (err, page) {
			res.render('admin/add_news', {
				title: page,
				file: '',
				category: category,
				headline: '',
				submittedBy: '',
				details: '',
				date: date,

				Title: 'Admin Add News',
				errorsType: errorsType,
				msg: msg
			});
		});
	});

});
/*
 *    Get data form Data base and show in table
*/


router.get('/fgdfgd', function (req, res) {
	console.log('Show all News');

	News.find({}).sort({ sorting: 0 }).exec(function (err, obj) {
		if (err) {
			console.log(err);
		} else {
			res.render('admin/news', {
				news: obj,
				Title: 'All News',
				errorsType: "",
				msg: ""
			});
		}
	});
});


// SET STORAGE
// const storage = multer.diskStorage({
// 	destination: './public/files/uploadsFiles/',

// 	filename: function (req, file, cb) {
// 		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
// 	}
// });


// const upload = multer({ storage: storage });
/*
 *	Post page get and save it.
*/
router.post('/uploads',function(req, res, next) {
var fileinfo = req.files;
console.log(fileinfo);
console.log(req.body);
	Category.find({}).exec(function (err, cat) {
				Pages.find({}).exec(function (err, page) {

					validationPostDataisEmpty(req.body, req.files[0], page, cat, res);
					ifHeading_isSame(req.body, page, cat, res);

					notEmpty_notSame_savefunction(req.body, req.files, page, cat, res);
				});
			});
});


function validationPostDataisEmpty(obj, file, page, cat, res) {

	if (obj.headline == ''  || obj.details == '') {
		res.render('admin/add_news', {
			title: page,
			file: '',
			category: cat,
			headline: '',
			submittedBy: '',
			details: '',
			date: new Date(),
			Title: 'Admin News',
			errorsType: 'alert alert-danger',
			msg: 'headline & submittedBy & details must have values'
		});
	}
}//end of validationPostDataisEmpty()

function ifHeading_isSame(obj, page, cat, res) {

	News.findOne({ headline: obj.headline }, function (err, news) {
		if (news) {

			res.render('admin/add_news', {
				title: page,
				file: obj.files,
				category: cat,
				headline: '',
				submittedBy: obj.submittedBy,
				details: obj.details,
				date: new Date(),
				Title: 'Admin News',
				errorsType: 'alert alert-danger',
				msg: obj.headline + ' headline is exist Choose Another'
			});
		}
	});
}//end of ifTitle_isSame()


function notEmpty_notSame_savefunction(obj, files, page, cat, res) {
var gallery;
	var news = new News({
		title: obj.title,
		category: obj.category,
		headline: obj.headline,
		submittedBy: obj.submittedBy,
		details: obj.details,
		date: obj.date,
		fieldname: files[0].fieldname,
		originalname: files[0].originalname,
		encoding: files[0].encoding,
		mimetype: files[0].mimetype,
		destination: files[0].destination,
		filename: files[0].filename,
		path: files[0].path,
		size: files[0].size,
		sorting: 1000
	});
	news.save(function (err) {
		if (err) return console.log(err);
		console.log(" successfuly Saved data");
		if(files.length>1){
		News.findOne({ headline: obj.headline }, function (err, news) {
			if (news) {
		var ids = news._id;
		for(var i=0; i<files.length; i++){
			if(files[i].filename==news.filename){
				files.shift();//shift loop to next iteration
			}
				 gallery = new Gallery({
					id: ids,
				fieldname: files[i].fieldname,
				originalname: files[i].originalname,
				encoding: files[i].encoding,
				mimetype: files[i].mimetype,
				destination: files[i].destination,
				filename: files[i].filename,
				path: files[i].path,
				size: files[i].size
			});
			gallery.save(function (err) {
				if (err) return console.log(err);
				console.log(" successfuly Saved data");	
			});
		}
			}
					});
					}
		res.render('admin/add_news', {
			title: page,
			category: cat,
			file: '',
			headline: '',
			submittedBy: '',
			details: '',
			date: new Date(),
			Title: 'Admin Pages',
			errorsType: 'alert alert-success',
			msg: 'successfuly News is Added'
		});
	});
}//end of notEmpty_notSame_savefunction()


/*
// POST reorder News
*/
router.post('/reordernews', urlencodedParser, function (req, res) {

	var ids = req.body.id;
	var idsLength = req.body.id.length;
	var count = 0;
	for (var i = 0; i < idsLength; i++) {
		var id = ids[i];

		(function (count) {
			News.findById(id, function (err, news) {
				news.sorting = count;
				news.save(function (err) {
					if (err) return console.log(err);
				});
			});
		})(count);
		count++;
	}
});//end of reorderNews


// get editpages

router.get('/editnews/:id', function (req, res) {
	var errorsType = "";
	var msg = "";
	var ids = req.params.id;
	News.findById(ids, function (err, obj) {
		if (err) return console.log(err); 
		Category.find({}).exec(function (err, cat) {
			Pages.find({}).exec(function (err, page) {
				Gallery.find({ id: ids }, function (err, gallery){
				
				res.render('admin/edit_news', {
					fileExtention: obj.mimetype,
					files: '/files/uploadsFiles/' + obj.filename,
					file_id:obj._id,
					galleries: gallery,
					title: page,
					category: cat,
					headline: obj.headline,
					submittedBy: obj.submittedBy,
					details: obj.details,
					date: obj.date,
					Title: 'Admin news',
					errorsType: errorsType,
					msg: msg,
					id: obj._id
				});// end render
			});//end gallery
			});//end pages
		});//end category

	});//end news
});//end get editnews

/*
 *	Post Edit page get and save it.
*/

router.post('/editnews',function(req, res, next) {
	var fileinfo = req.files;
	var ids = req.body.id;
	 	Category.find({}).exec(function (err, category) {
			Pages.find({}).exec(function (err, page) {
				Gallery.find({ id: ids }, function (err, gallery){
					validationEdit_isEmpty(req.body,category,page,gallery,res);	
					notEmpty_justUpdateOfEdit(req.body,req.files,category,page,gallery,res);

					res.redirect('/adminnews');
		});

		});
	});




});//end of post editpage;


function validationEdit_isEmpty(obj,cat,page,gallery,res) {
	
	var ids = obj._id;
	var filename =obj.old_file;
	if ( obj.headline == '' && obj.details =='') {
		res.render('admin/edit_news',{
			fileExtention: obj.fileExtention,
			file: filename,
			file_id:obj._id,
			galleries: gallery,
			title: page,
			category: cat,
			headline: '',
			submittedBy: obj.submittedBy,
			details: '',
			date: obj.date,
			Title: 'Admin news',
			errorsType: 'alert alert-danger',
			msg: 'HeadLine and Details Must hava value',
			id: obj._id

		});
	}else if(obj.details ==''){
		res.render('admin/edit_news',{
			fileExtention: obj.fileExtention,
			file: filename,
			file_id:obj._id,
			galleries: gallery,
			title: page,
			category: cat,
			headline: obj.headline,
			submittedBy: obj.submittedBy,
			details: '',
			date: obj.date,
			Title: 'Admin news',
			errorsType: 'alert alert-danger',
			msg: 'Details Must hava value',
			id: obj._id

		});
	}else if(obj.headline ==''){
		res.render('admin/edit_news',{
			fileExtention: obj.fileExtention,
			file: filename,
			file_id:obj._id,
			galleries: gallery,
			title: page,
			category: cat,
			headline: '',
			submittedBy: obj.submittedBy,
			details: obj.headline,
			date: obj.date,
			Title: 'Admin news',
			errorsType: 'alert alert-danger',
			msg: 'HeadLine Must hava value',
			id: obj._id

		});
	}
}//end of validationEdit_isEmpty()


function notEmpty_justUpdateOfEdit(obj,files,cat,page,gallery,res){
	console.log(obj.id);
	News.findById(obj.id, function (err, news) {
		console.log(news.fieldname);
		if(news.fieldname==''){// form edit news no file
			console.log("form edit news no file");


			if(files==undefined){//from edit News no file uploaded and no file in news collection
				console.log("from edit News no file uploaded and no file in news collection");
			console.log(files);
			 News.findByIdAndUpdate(obj.id,{title:obj.title,category:obj.category,headline:obj.headline,submittedBy:obj.submittedBy,details:obj.details,date:obj.date}, function (err, news) {
			 	if (err){ return console.log(err);}	
			 });
			}
			
			else if(files.length==1){//from edit News one file uploaded and no file in news collection
			console.log("from edit News one file uploaded and no file in news collection");
					News.findByIdAndUpdate(obj.id,{title:obj.title,category:obj.category,headline:obj.headline,submittedBy:obj.submittedBy,details:obj.details,date:obj.date,fieldname:files[0].fieldname,originalname:files[0].originalname,encoding:files[0].encoding,mimetype:files[0].mimetype,destination:files[0].destination,filename:files[0].filename,path:files[0].path,size:files[0].size}, function (err, news) {
					if (err){ return console.log(err);}	
				});
			}


			else if(files.length>1){//from edit News  files>1 uploaded and no file in news collection fist file save in news otherfiles save gallery collecton
				console.log("from edit News  files>1 uploaded and no file in news collection fist file save in news otherfiles save gallery collecton");
				News.findByIdAndUpdate(obj.id,{title:obj.title,category:obj.category,headline:obj.headline,submittedBy:obj.submittedBy,details:obj.details,date:obj.date,fieldname:files[0].fieldname,originalname:files[0].originalname,encoding:files[0].encoding,mimetype:files[0].mimetype,destination:files[0].destination,filename:files[0].filename,path:files[0].path,size:files[0].size}, function (err, news) {
					if (err){ return console.log(err);}	
				});
				News.findOne({ _id: obj.id }, function (err, newss) {
					if (newss) {
				for(var i=0; i<files.length; i++){
					console.log("file Data :"+files[0].filename);
					console.log("News Data :"+news.filename);
					 if(files[i].filename==files[0].filename){
					 	console.log("condition True");
					files.shift();//shift loop to next iteration
					 }
						 gallery = new Gallery({
							id: obj.id,
						fieldname: files[i].fieldname,
						originalname: files[i].originalname,
						encoding: files[i].encoding,
						mimetype: files[i].mimetype,
						destination: files[i].destination,
						filename: files[i].filename,
						path: files[i].path,
						size: files[i].size
					});
					gallery.save(function (err) {
						if (err) return console.log(err);
						console.log(" successfuly Saved data");	
					});
				}
				}
			});
			
			}
		}else{//if news file is exist save in gallary collection
			console.log("if news file is exist save in gallary collection");
			for(var i=0; i<files.length; i++){
				
				 gallery = new Gallery({
						id: obj.id,
					fieldname: files[i].fieldname,
					originalname: files[i].originalname,
					encoding: files[i].encoding,
					mimetype: files[i].mimetype,
					destination: files[i].destination,
					filename: files[i].filename,
					path: files[i].path,
					size: files[i].size
				});
				gallery.save(function (err) {
					if (err) return console.log(err);
					console.log(" successfuly Saved data");	
				});
			}
		}
	});
}//end notEmpty_justUpdateOfEdit()

router.get('/deleteGalleryFile/:id',function(req,res) { //delete image
var ids = req.params.id;
Gallery.findById({_id: ids},function(err,image){
	console.log(image);
	var newsId = image.id;
if(image){
	deleteImage(image);
	res.redirect('/adminnews/editnews/'+newsId);
}else{
	res.redirect('/adminnews');
}
});

});//end delete image
function deleteImage(image){
	if(image.path!=[]){
		fs.unlink(image.path,function(err){
			if(err){
				console.log(err);
			}
		});
	}
		Gallery.findByIdAndDelete(image._id, function(err){
			if (err) throw err;
		});		
}
router.get('/deleteNewsFile/:id',function(req,res){
	var ids = req.params.id;
	News.findById({_id: ids},function(err,file){
	if(file){
		deleteNewsFiles(file,ids);
		res.redirect('/adminnews/editnews/'+ids);
	}else{
		res.redirect('/adminnews');
	}
	});
});
function deleteNewsFiles(file,ids){
	if(file.path!=[]){
	fs.unlink(file.path,function(err){
	});
}
	Gallery.find({ id: ids }, function (err, files){
		if(files[0]==undefined){
			News.findByIdAndUpdate(ids,{fieldname:'',originalname:'',encoding:'',mimetype:'',destination:'',filename:'',path:'',size:0}, function (err, news) {
				if (err){ return console.log(err);}
				
			});
		}else{
			News.findById(ids, function (err, news) {	
				if(news){
				news.fieldname= files[0].fieldname;
				news.originalname= files[0].originalname;
				news.encoding= files[0].encoding;
				news.mimetype= files[0].mimetype;
				news.destination= files[0].destination;
				news.filename= files[0].filename;
				news.path= files[0].path;
				news.size= files[0].size;
				news.save(function (err) {
					if (err) return console.log(err);
				});
			}
				Gallery.findByIdAndDelete(files[0]._id, function(err){
					if (err) throw err;
				});
			});
				}
	});

}		
// }
/*
	 Get delete news page 
*/
router.get('/deletenews/:id', function (req, res) {

	var errorsType = "alert alert-success";
	var msg = "successfuly News is Deleted";
	var ids = req.params.id;
	
	Gallery.find({ id: ids }, function (err, gallery){
		if(gallery){
			deleteGalleries(gallery);
		}
	});	
	deleteNewsfunction(ids);
	res.redirect('/adminnews');
});

function deleteGalleries(Galleries){
	for(var i=0; i<Galleries.length; i++){
			fs.unlink(Galleries[i].path,function(err){
			});
		Gallery.findByIdAndDelete(Galleries[i]._id, function(err){
			if (err) throw err;
		});	
	   }
}//end deleteGalleries

function deleteNewsfunction(newsId) {
	News.find({ _id: newsId }, function (err, news){
		if(news){
			for(var i=0; i<news.length; i++){
			fs.unlink(news[i].path,function(err){
				   });
	 News.findByIdAndDelete(news[i]._id, function (err) {
		 if (err) throw err;
	 });
			}
		}
	});
}//delete end

router.get('/photo/:id', (req, res) => {
	var filename = req.params.id;

	News.findOne({ _id: filename }, (err, result) => {

		if (err) return console.log(err)

		res.contentType('image/jpeg');
		res.send(result.myFile.buffer)


	});
});
//Exports
module.exports = router;
