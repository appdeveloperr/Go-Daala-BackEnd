var mongoose = require('mongoose');

//page schema 
var postchema= mongoose.Schema({
input_text:{
			type: String,
			required: true
},
person_id:{
			type: String,
			required: true
},
date:{
			type: String,
			required: true
 }
});
var Posting = mongoose.model('posting',postchema);
module.exports =Posting;