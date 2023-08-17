const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");
const user = require("./utility/user");
const logger = require("./utility/logger");

router.get("/", async (req, res, next) => {
  console.log("insPay Start");
  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      var userInfo = await user.getPosition(email);

      if (userInfo.position !== "7" && userInfo.position !== "9") {
        var error = new Error();
        error.errCode = "401";
        next(error);
        return;
      }
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }

    //DBに接続する
    var conn = await pool.getConnection();
    try {
      var employees = await conn.query(
        "SELECT employee_no, lastname_hanja, firstname_hanja FROM employee"
      );
    } catch (error) {
      conn.close();
      //console.log(error);
      logger.error(error.stack);
      error.errCode = "500";
      //error.message = "someError";
      next(error);
      return;
    }
    conn.close();

    res.render("insPay", {
      postion: userInfo.position,
      emp: employees,
    });
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
