'use strict';

require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const routes = require("./routes");

const { passport, jwtStrat, localStrat } = require("./passport");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(passport.initialize());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(localStrat);
passport.use(jwtStrat);

app.use("/newAccount", routes.newAccount);
app.use("/login", routes.login);
app.use("/", routes.root);
app.use("/profile", passport.authenticate('jwt', {session: false}), routes.profile);


module.exports = app;