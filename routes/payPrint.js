const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");
const logger = require("./utility/logger");

const user = require("./utility/user");
const bank = require("./utility/bank");

router.post("/", async (req, res, next) => {
  console.log(req.body);
  if (req.session.passport) {
    var email = req.session.passport.user;

    try {
      if (req.body.employee_no !== undefined) {
        var employee = await user.getEmployee(req.body.employee_no);  
      } else {
        var employee = await user.getEmployeeByEmail(email);
      }
      var full_bank = await bank.getBankFull(employee.employee_no);
      var full_bank_name = full_bank.bank_name + "（" + full_bank.point_name + "）普通 " + full_bank.account;
    } catch (error) {
      error.errCode = "500";
      next(error);
      return;
    }

    let [year, month] = req.body.inDate.split("-");
    var tot_pay = 0;
    var deduction = 0;
    var result_pay = 0;

    //let [base_pay, special_pay, position_pay, house_pay, function_pay, overtime_pay, benefits_pay, dependent, transportation_costs, health_annuity, welfare_annuity, friendly_society_pee, travelling_expenses, income_tax, residence_tax, dormitory_pee] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var conn = await pool.getConnection();
    try {
      var pay = await conn.query(
        "SELECT * FROM pay WHERE employee_no = ? AND year = ? AND month = ?",
        [employee.employee_no, year, month]
      );

      if (pay.length === 0) {
        pay = await conn.query("SELECT * FROM mst_pay WHERE employee_no = ?", [
          employee.employee_no,
        ]);
      } else {
        tot_pay = pay[0].base_pay + pay[0].position_pay + pay[0].house_pay + pay[0].function_pay + pay[0].benefits_pay + pay[0].special_pay + pay[0].overtime_pay + pay[0].transportation_costs;
        deduction = pay[0].dormitory_pee + pay[0].health_annuity + pay[0].welfare_annuity + pay[0].friendly_society_pee + pay[0].residence_tax + pay[0].income_tax + pay[0].travelling_expenses;
        result_pay = tot_pay - deduction;
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

    var dt = new Date(year, month - 1);
    var opt = { year: "numeric", month: "long" };
    var wareki = dt.toLocaleDateString("ja-JP-u-ca-japanese", opt);

    res.render("payment", {
      wareki: wareki,
      name: employee.lastname_hanja + " " + employee.firstname_hanja,
      pay: pay[0],
      tot_pay: tot_pay,
      deduction: deduction,
      result_pay: result_pay,
      full_bank_name: full_bank_name
    });
  } else {
    var error = new Error();
    error.errCode = "401";
    next(error);
    return;
  }
});

module.exports = router;
