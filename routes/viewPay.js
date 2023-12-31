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

    var now = new Date();
    var inDate = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart( 2, '0');

    res.render("viewPay", { position: position, inDate: inDate });
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
