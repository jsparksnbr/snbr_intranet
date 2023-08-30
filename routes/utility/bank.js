const pool = require("./pool");
const logger = require("./logger");

async function getBankFull(employee_no) {
  //DBに接続する
  var conn = await pool.getConnection();
  try {
    var employee = await conn.query(
      "SELECT mst_bank.bank_name, point_name, account FROM employee INNER JOIN mst_bank on bank = mst_bank.bank_no WHERE employee_no = ?",
      [employee_no]
    );
    console.log("----------- bank");
    conn.close();
    return employee[0];
  } catch (error) {
    conn.close();
    logger.error(error.stack);
    throw new Error();
  }
}

module.exports.getBankFull = getBankFull;
