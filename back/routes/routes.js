const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    return err
      ? res.status(err.status).json(err)
      : !user
      ? res.status(info.status).json({ error: info.message })
      : req.login(user, { session: false }, (error) => {
          if (error) return next(error);
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");
          return res.json({ message: "Signup successful", user, token });
        });
  })(req, res, next);
});

// ...

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    return err
      ? res.status(err.status).json(err)
      : !user
      ? res.status(info.status).json({ error: info.message })
      : req.login(user, { session: false }, (error) => {
          if (error) return next(error);
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");
          return res.json({ token });
        });
  })(req, res, next);
});

module.exports = router;