const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");
const logger = require("./utility/logger");

const user = require("./utility/user");

router.post("/", async (req, res, next) => {
  console.log(req.body);
  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      var employee = await user.getEmployeeByEmail(email);
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }

    let [year, month] = req.body.inDate.split("-");

    var conn = await pool.getConnection();
    try {
      var pay = await conn.query(
        "SELECT * FROM pay WHERE employee_no = ? AND year = ? AND month = ?",
        [employee.employee_no, year, month]
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

    var dt = new Date(year, month - 1);
    var opt = { year: "numeric", month: "long" };
    var wareki = dt.toLocaleDateString("ja-JP-u-ca-japanese", opt);

    res.render("payment", {
      wareki: wareki,
      name: employee.lastname_hanja + " " + employee.firstname_hanja,
      pay: pay[0],
    });
  } else {
    var error = new Error();
    error.errCode = "401";
    next(error);
    return;
  }
});

module.exports = router;
