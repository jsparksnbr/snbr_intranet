const pool = require("./pool");
const logger = require("./logger");

async function getPosition(email) {
  //DBに接続する
  var conn = await pool.getConnection();
  try {
    var user = await conn.query(
      "SELECT position FROM employee where email = ?",
      [email]
    );
    conn.close();
    return user[0].position;
  } catch (error) {
    conn.close();
    logger.error(error.stack);
    throw new Error();
  }
}

async function getEmployeeNo(email) {
  //DBに接続する
  var conn = await pool.getConnection();
  try {
    var user = await conn.query(
      "SELECT employee_no FROM employee where email = ?",
      [email]
    );
    conn.close();
    return user[0].employee_no;
  } catch (error) {
    conn.close();
    logger.error(error.stack);
    throw new Error();
  }
}

async function getEmployee(employee_no) {
  //DBに接続する
  var conn = await pool.getConnection();
  try {
    var employee = await conn.query(
      "SELECT * FROM employee where employee_no = ?",
      [employee_no]
    );
    conn.close();
    return employee[0];
  } catch (error) {
    conn.close();
    logger.error(error.stack);
    throw new Error();
  }
}

async function getEmployeeByEmail(email) {
  //DBに接続する
  var conn = await pool.getConnection();
  try {
    var employee = await conn.query("SELECT * FROM employee where email = ?", [
      email,
    ]);
    conn.close();
    return employee[0];
  } catch (error) {
    conn.close();
    logger.error(error.stack);
    throw new Error();
  }
}

module.exports.getPosition = getPosition;
module.exports.getEmployeeNo = getEmployeeNo;
module.exports.getEmployee = getEmployee;
module.exports.getEmployeeByEmail = getEmployeeByEmail;
