const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");

const logger = require("./utility/logger");

const user = require("./utility/user");

router.get("/", async (req, res, next) => {
  let { inDate, employee_no } = req.query;

  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      var position = await user.getPosition(email);

      if (position !== "7" && position !== "9") {
        var error = new Error();
        error.errCode = "401";
        next(error);
        return;
      }

      var employee = await user.getEmployee(employee_no);
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }

    //DBに接続する
    var conn = await pool.getConnection();
    try {
      let [year, month] = inDate.split("-");
      console.log(year);
      console.log(month);
      var initFlg = 0;
      var pay = await conn.query(
        "SELECT * FROM pay WHERE employee_no = ? AND year = ? AND month = ?",
        [employee_no, year, month]
      );

      if (pay.length === 0) {
        pay = await conn.query("SELECT * FROM mst_pay WHERE employee_no = ?", [
          employee_no,
        ]);
        initFlg = 1;
      }
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

    res.render("setPayment", {
      name: employee.lastname_hanja + " " + employee.firstname_hanja,
      emp_no: employee_no,
      inDate: inDate,
      email: employee.email,
      pay: pay[0],
      initFlg: initFlg,
    });
  } else {
    res.redirect("/auth/google");
  }
});

router.post("/", async (req, res, next) => {
  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      var position = await user.getPosition(email);

      if (position !== "7" && position !== "9") {
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
      console.log(req.body);
      var [year, month] = req.body.inDate.split("-");
      console.log(req.body.inDate);
      console.log(year);
      console.log(month);
      if (req.body.initFlg === "1") {
        var result = await conn.query(
          "INSERT INTO pay (employee_no, year, month, base_pay, special_pay, position_pay, house_pay, function_pay, overtime_pay, benefits_pay, " +
            "dependent, transportation_costs, health_annuity, welfare_annuity, friendly_society_pee, travelling_expenses, income_tax, residence_tax, dormitory_pee) " +
            "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            req.body.employee_no,
            year,
            month,
            Number(req.body.base_pay),
            Number(req.body.special_pay),
            Number(req.body.position_pay),
            Number(req.body.house_pay),
            Number(req.body.function_pay),
            Number(req.body.overtime_pay),
            Number(req.body.benefits_pay),
            Number(req.body.dependent),
            Number(req.body.transportation_costs),
            Number(req.body.health_annuity),
            Number(req.body.welfare_annuity),
            Number(req.body.friendly_society_pee),
            Number(req.body.travelling_expenses),
            Number(req.body.income_tax),
            Number(req.body.residence_tax),
            Number(req.body.dormitory_pee),
          ]
        );
      } else {
        var result = await conn.query(
          "UPDATE pay SET base_pay = ?, special_pay = ?, position_pay = ?, house_pay = ?, function_pay = ?, overtime_pay = ?, benefits_pay = ?, dependent = ?, " +
            "transportation_costs = ?, health_annuity = ?, welfare_annuity = ?, friendly_society_pee = ?, travelling_expenses = ?, income_tax = ?, residence_tax = ?, dormitory_pee = ? " +
            "WHERE employee_no = ? AND year = ? AND month = ?",
          [
            Number(req.body.base_pay),
            Number(req.body.special_pay),
            Number(req.body.position_pay),
            Number(req.body.house_pay),
            Number(req.body.function_pay),
            Number(req.body.overtime_pay),
            Number(req.body.benefits_pay),
            Number(req.body.dependent),
            Number(req.body.transportation_costs),
            Number(req.body.health_annuity),
            Number(req.body.welfare_annuity),
            Number(req.body.friendly_society_pee),
            Number(req.body.travelling_expenses),
            Number(req.body.income_tax),
            Number(req.body.residence_tax),
            Number(req.body.dormitory_pee),
            req.body.employee_no,
            year,
            month,
          ]
        );
      }
      console.log("result => " + result);
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

    res.redirect("/insPay");
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
