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
router.use(express.urlencoded());


router.get('/test', function (req, res) {
	console.log('test');
	//res.redirect('/adminnews');

});

router.post('/login', function (req, res) {
	req.checkBody('email','Email have must have value!').notEmpty();
	req.checkBody('password','Password have must have value!').notEmpty();
	var email = req.body.email;
	var password = req.body.password;
	var errors = req.validationErrors();
	if (errors) {
		console.log("error validation");
		res.render('admin/login', {
			errors: errors,
			email: email,
			password: password

		});
	} else{
		console.log("this is a trecker")
	}
});

//Exports
module.exports = router;
