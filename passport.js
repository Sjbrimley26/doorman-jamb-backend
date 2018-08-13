const { verifyPassword } = require("./utilities");

const { getItem } = require("./db");

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const localStrat = new LocalStrategy({
  usernameField: 'email',
  session: false
},

function (email, password, next) {
  verifyPassword(email, password, next)
    .then(user => {
      return next(null, user, {
        message: "Logged in successfully!"
      });
    })
    .catch(err => next(err));

});

const jwtStrat = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  session: false
},

async function (jwtPayload, cb) {
  const params = {
    TableName: "doormanUsers",
    Key: {
      "email": {
        S: jwtPayload.username
      }
    }
  };

  getItem(params)
    .then(user => cb(null, user))
    .catch(err => cb(err));

});

module.exports = {
  passport,
  localStrat,
  jwtStrat
};