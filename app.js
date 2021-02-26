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



//Set public Folder
app.use(express.static(path.join(__dirname, '/public/')));
//Set Global  errors variable 
app.locals.errors=null;


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./models/api_models");
const Role = db.role;

// // force: true will drop the table if it already exists
// db.sequelize.sync({force: false}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });





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
require('./config/passport')(passport);
//Passport Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());





//simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Go-Daala Application" });
// });

// set routes
require('./routes/api_routes/auth.routes')(app);
require('./routes/api_routes/user.routes')(app);
require('./routes/admin_routes/admin.routes')(app);


// var auth = require('./routes/api_routes/auth.routes');
// app.use('/',auth);

// var admin = require('./routes/admin_routes/admin.routes');
// app.use('/',admin);

// var user = require('./routes/api_routes/user.routes');
// app.use('/',user);

//Set routes
//var pages = require('./routes/pages.js');
// app.use('/', function(req,res){
//     res.send('hello every one');
// });

// var admin_routes = require('./routes/admin.js');
// app.use('/admin', admin_routes);


// var users_routes = require('./routes/users_panel.js');
// app.use('/users', users_routes);

// var adminSignin = require('./routes/authentication.js');
// app.use('/signin', adminSignin);

//Start the server

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



// function initial() {

//   //   //---------- INSERTING DUMMY ROLES ----------
//     Role.create({
//       id: 1,
//       name: "user"
//     });
   
//     Role.create({
//       id: 2,
//       name: "moderator"
//     });
   
//     Role.create({
//       id: 3,
//       name: "admin"
//     });
  
  
//   };
  