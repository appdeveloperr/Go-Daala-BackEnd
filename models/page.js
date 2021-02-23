var mongoose = require('mongoose');

//page schema 
var pagechema= mongoose.Schema({
sorting:{
		type: String,
		required: true
},
page:{
			type: String,
			required: true
}
});
var page = mongoose.model('PAGE',pagechema);
module.exports =page;