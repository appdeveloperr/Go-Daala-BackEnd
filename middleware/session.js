var session = require('express-session');
module.exports = function(app) {
 // express session middelware
app.set('trust proxy', 1)
app.use(session({
  secret: 'max',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

};