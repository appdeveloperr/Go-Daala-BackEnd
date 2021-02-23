
// config/passport.js

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require("../models/api_models");
const User = db.user;
// expose this function to our app using module.exports
module.exports = function (passport) {

  passport.use(
    new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
            //match user
            User.findOne({ WHERE: {
              email: email
            }})
            .then((user)=>{
             if(!user) {
              return done(null, false, { message: 'Incorrect email.' });
             }
            //  console.log(user.dataValues)
             //match pass
             bcrypt.compare(password,user.dataValues.password,(err,isMatch)=>{
                 if(err) throw err;

                 if(isMatch) {
                     return done(null,user.dataValues);
                 } else {
                  return done(null, false, { message: 'Incorrect password.' });
                 }
             })
            })
            .catch((err)=> {console.log(err)})
    })
    
)
passport.serializeUser(function(user, done) {
  
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findOne({WHERE:{
    id: id
    }}).then((user)=>{
      done(null, user.dataValues);
    }).catch((err)=> {console.log(err)})
  }); 

};