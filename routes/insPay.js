const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");
const user = require("./utility/user");

router.get("/", async (req, res, next) => {
  console.log("insPay Start");
  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      var position = await user.getPosition(email);
      var employees = await user.getAllUserName();
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }

    res.render("insPay", {
      position: position,
      emp: employees,
    });
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
