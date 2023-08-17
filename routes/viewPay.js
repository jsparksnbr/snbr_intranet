const express = require("express");
const router = express.Router();

const user = require("./utility/user");

router.get("/", async (req, res, next) => {
  if (req.session.passport) {
    var email = req.session.passport.user;
    try {
      var position = await user.getPosition(email);
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }
    res.render("viewPay", { position: position });
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
