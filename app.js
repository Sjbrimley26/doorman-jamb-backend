'use strict';

require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require("./routes");

const passport = require("passport");

require("./passport");

app.use(passport.initialize());

app.use("/newAccount", routes.newAccount);
app.use("/login", routes.login);
app.use("/", routes.root);
app.use("/profile", passport.authenticate('jwt', {session:false}), routes.profile);

passport.serializeUser(function (user, done) {
  console.log("SERIALIZE", user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


module.exports = app;