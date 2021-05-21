var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
var flash = require('connect-flash');
const cors = require("cors");
const app = express();
var bcrypt = require("bcrypt");
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fileUpload = require('express-fileupload');

 var socket_io = require('./config/socket.chats').socket_io(io);
 var socket_lat_long = require('./config/socket.lat_long').socket_lat_long(io);

var corsOptions = {
  origin: "*",
  methods: [
    'GET',
    'POST',
    'PUT'
  ],
};

app.use(cors(corsOptions));

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Global  errors variable 
app.locals.errors = null;

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
//app.use(upload.array()); 


//app.use(express.static(path.join(__dirname, '/Go-Daala-BackEnd/public/')));
app.use(express.static(path.join(__dirname, '/public/')));



// database
const db = require("./models/api_models");
// const Role = db.role;
const User = db.user;

// // force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
console.log('Drop and Resync Database with { force: true }');
 initial();
});



//-------- express session middelware -----------------
 app.set('trust proxy', 1)
 app.use(session({
   secret: 'max',
   resave: true,
   saveUninitialized: true,
   cookie: { secure: false }
 }));

// express validater middelware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default: return false;
      }
    }
  }
}));



//express messages middelware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function (req, res, next) {
  res.locals.user = req.session.user || null;
  next();
});

//passport Config
require('./middleware/passport')(passport);


//Passport Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());





//simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Go-Daala Application" });
// });

// set routes
//----------- Admin Panel Routes ---------------
require('./routes/admin_routes/auth.routes')(app);
require('./routes/admin_routes/dashboard.routes')(app);
require('./routes/admin_routes/banner.routes')(app);
require('./routes/admin_routes/promo.routes')(app);
require('./routes/admin_routes/vehicle.routes')(app);
require('./routes/admin_routes/vendor.routes')(app);
require('./routes/admin_routes/driver.routes')(app);
require('./routes/admin_routes/booking.routes')(app);
require('./routes/admin_routes/help_and_support.routes')(app);
require('./routes/admin_routes/faq.routes')(app);
require('./routes/admin_routes/notification.routes')(app);
require('./routes/admin_routes/logout.routes')(app);
require('./routes/admin_routes/contectus.routes')(app);



//----------- API Routes --------------------

//-----------------Vendor Api routes--------------
require('./routes/api_routes/vendor/auth.routes')(app);
require('./routes/api_routes/vendor/forgot_password.routes')(app);
require('./routes/api_routes/vendor/address.routes')(app);
require('./routes/api_routes/vendor/trip.routes')(app);
require('./routes/api_routes/vendor/validation_promo_code.routes')(app);
require('./routes/api_routes/vendor/otp.routes')(app);
require('./routes/api_routes/vendor/contectus.routes')(app);
require('./routes/api_routes/vendor/faq.routes')(app);
require('./routes/api_routes/vendor/review.routes')(app);
require('./routes/api_routes/vendor/chat.routes')(app);

//-----------------Customer Api routes--------------
require('./routes/api_routes/customer/auth.routes')(app);
require('./routes/api_routes/customer/forgot_password.routes')(app);
require('./routes/api_routes/customer/address.routes')(app);
require('./routes/api_routes/customer/trip.routes')(app);
require('./routes/api_routes/customer/validation_promo_code.routes')(app);
require('./routes/api_routes/customer/otp.routes')(app);
require('./routes/api_routes/customer/contectus.routes')(app);
require('./routes/api_routes/customer/faq.routes')(app);
require('./routes/api_routes/customer/review.routes')(app);
require('./routes/api_routes/customer/chat.routes')(app);

//-----------------driver Api routes--------------
require('./routes/api_routes/driver/auth.routes')(app);
require('./routes/api_routes/driver/forgot_password.routes')(app);
require('./routes/api_routes/driver/vehicle_reg.routes')(app);
require('./routes/api_routes/driver/trip.routes')(app);
require('./routes/api_routes/driver/otp.routes')(app);
require('./routes/api_routes/driver/current_location.routes')(app);
require('./routes/api_routes/driver/faq.routes')(app);
require('./routes/api_routes/driver/review.routes')(app);
require('./routes/api_routes/driver/contectus.routes')(app);
require('./routes/api_routes/driver/chat.routes')(app);



//Start the server
// set port, listen for requests
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



function initial() {


  //------ Inserting Dumy Admin Data ----
  User.create({
    username: "admin",
    email: "admin@godaala.com",
    password: bcrypt.hashSync("admin@godaala", 8)
  })

};
