'use strict';

require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS"
  );

  if (req.method == 'OPTIONS') {
    res.sendStatus(204);
  }

  next();
});

const routes = require("./routes");

const passport = require("passport");

require("./passport");

app.use(passport.initialize());

app.use("/newAccount", passport.authenticate('jwt', {session:false}), routes.newAccount);
app.use("/login", routes.login);
app.use("/", routes.root);
app.use("/profile", passport.authenticate('jwt', {session:false}), routes.profile);
app.use("/changePassword", passport.authenticate('jwt', {session:false}), routes.changePassword);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


module.exports = app;