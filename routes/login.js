const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { passport } = require("../passport");


router.post("/", (req, res, next) => {
  passport.authenticate('local', {
      session: false
    },
    (err, user, info) => {
      res.json({err: "Wher"})
      if (err) return next(err);

      req.login(user, err => {
        if (err) return next(err);

        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({
          username,
          token
        });
      });

    })(req, res, next)
});

module.exports = router;