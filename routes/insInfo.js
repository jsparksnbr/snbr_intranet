const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");

const logger = require("./utility/logger");

router.get("/", async (req, res, next) => {
  console.log("insInfo Start");
  if (req.session.passport) {
    var email = req.session.passport.user;

    var conn = await pool.getConnection();
    try {
      var position = await conn.query("SELECT * FROM mst_position");
      var bank = await conn.query("SELECT * FROM mst_bank");
      var department = await conn.query("SELECT * FROM mst_department");
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

    res.render("insInfo", {
      email: email,
      position: position,
      bank: bank,
      department: department,
    });
  } else {
    res.redirect("/auth/google");
  }
});

router.post("/", async (req, res, next) => {
  console.log(req.body);
  //console.log(req.body.employee_no.toUpperCase());
  //console.log(req.body.phone_cellular.replace(/-/g, ""));

  if (req.session.passport) {
    var email = req.session.passport.user;

    var conn = await pool.getConnection();

    try {
      var result = await conn.query(
        "INSERT INTO employee (employee_no, email, department, birthday, phone_home, phone_cellular, lastname_hanja, firstname_hanja, lastname_katakana, firstname_katakana, " +
          "lastname_eng, firstname_eng, lastname_kor, firstname_kor, position, zipcode, province, city, street, apartment, bank, point_name, account, join_date) " +
          "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.body.employee_no,
          email,
          req.body.department,
          req.body.birthday,
          req.body.phone_home,
          req.body.phone_cellular,
          req.body.lastname_hanja,
          req.body.firstname_hanja,
          req.body.lastname_katakana,
          req.body.firstname_katakana,
          req.body.lastname_eng.toUpperCase(),
          req.body.firstname_eng.toUpperCase(),
          req.body.lastname_kor,
          req.body.firstname_kor,
          req.body.position,
          req.body.zipcode,
          req.body.province,
          req.body.city,
          req.body.street,
          req.body.apartment,
          req.body.bank,
          req.body.point_name,
          req.body.account,
          req.body.join_date,
        ]
      );
    } catch (error) {
      conn.close();
      logger.error(error.stack);
      error.errCode = "500";
      next(error);
      return;
    }
    conn.close();
    res.redirect("/index");
  } else {
    res.redirect("/auth/google");
  }
});

module.exports = router;
