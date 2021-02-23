var session = require('express-session');
module.exports = function(app) {
 // express session middelware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }));
};