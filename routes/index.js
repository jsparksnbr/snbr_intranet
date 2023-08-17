const express = require("express");
const router = express.Router();

const pool = require("./utility/pool");

const logger = require("./utility/logger");

router.get("/", async (req, res, next) => {
  if (req.session.passport) {
    var email = req.session.passport.user;

    var conn = await pool.getConnection();
    try {
      var rows = await conn.query("SELECT * FROM employee where email = ?", [
        email,
      ]);
      conn.close();
    } catch (error) {
      conn.close();
      logger.error(error.stack);
      error.errCode = "500";
      next(error);
      return;
    }
    if (rows.length === 0) {
      res.redirect("/insInfo");
    } else {
      res.render("index", { position: rows[0].position });
    }
    return;
  } else {
    res.redirect("/auth/google");
  }

  res.render("index", {});
});

module.exports = router;
