const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use(passport.authenticate("jwt", { session: false }));

router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.users,
    token: req.query.secret_token,
  });
  console.log(req.users);
});

module.exports = router;