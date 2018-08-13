'use strict';

require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const routes = require("./routes");

const { passport } = require("./passport");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/newAccount", routes.newAccount);
app.use("/login", routes.login);
app.use("/", routes.root);
app.use("/profile", routes.profile);


module.exports = app;