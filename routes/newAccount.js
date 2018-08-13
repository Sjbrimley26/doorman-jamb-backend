const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { dynamoDB, putItem } = require("../db");
const { bcryptHash } = require("../utilities");

router.post("/", (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) next(new Error("Email or password missing!"));

  /*
  bcryptHash(password, 10).then(hash => {
    const params = {
      Item: {
        "email": {
          S: email
        },
        "password": {
          S: hash
        }
      },
      TableName: "doormanUsers",
      ConditionExpression: `attribute_not_exists(email)`
    };

    putItem(params)
      .then(() => res.send("Email registered!"))
      .catch(err => {
        next(new Error("Email already registered!"))
      })
  })
  .catch(err => next(err));
  */

  
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) return next(err);

    const params = {
      Item: {
        "email": {
          S: email
        },
        "password": {
          S: hash
        }
      },
      TableName: "doormanUsers",
      ConditionExpression: `attribute_not_exists(email)`
    };

    dynamoDB.putItem(params, function (err) {
      if (err) next(new Error("Email already registered!"));
      else res.send("Email registered!");
    });

  });
  

});

module.exports = router;