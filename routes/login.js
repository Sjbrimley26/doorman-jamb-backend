const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const passport = require("passport");

require("dotenv").config();

router.post("/", (req, res, next) => {
  passport.authenticate('local', {
      session: false
    },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.json({ message: "Invalid username or password!" });
      req.login(user, err => {
        if (err) return next(err);

        const token = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({
          username: user,
          token
        });
      });

    })(req, res, next)
});

module.exports = router;