const express = require("express");
const router = express.Router();
const verifyPassword = require("../utilities").verifyPassword;
const updateItem = require("../db").updateItem;
const bcrypt = require("bcryptjs");

router.post("/", async (req, res, next) => {
  const {
    email,
    newPassword,
    existingPassword
  } = req.body;

  const [user, hash] = await Promise.all([
    verifyPassword(email, existingPassword, next),
    bcrypt.hash(newPassword, 10)
  ]);

  if (typeof user == "undefined") return res.json({ err: "Invalid password!" });

  const params = {
    TableName: "doormanUsers",
    Key: {
      "email": {
        S: email
      }
    },
    UpdateExpression: "set password = :p",
    ExpressionAttributeValues: {
      ":p": {"S": hash}
    },
    ReturnValues: "UPDATED_NEW"
  };

  updateItem(params)
    .then(() => res.json({message: "Password changed!"}))
    .catch(err => res.json({err: err}))

});

module.exports = router;