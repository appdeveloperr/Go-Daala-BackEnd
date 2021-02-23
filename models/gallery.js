var mongoose = require('mongoose');

//page schema 
var gallerychema= mongoose.Schema({
posting_id:{
			type: String,
			required: true
},
path:{
			type: String,
			required: true
 }
});
var Gallery = mongoose.model('gallery',gallerychema);
module.exports =Gallery;