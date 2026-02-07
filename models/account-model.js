const pool = require("../database/");

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.error("Database Error Details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint,
    });
    throw error;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email],
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function checkExistingPassword(account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_password = $1";
    const password = await pool.query(sql, [account_password]);
    return password.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Get account data by account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id],
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

/* *****************************
 * Update account information
 * ***************************** */
async function updateAccountInfo(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateAccountInfo error: " + error);
    return error;
  }
}

/* *****************************
 * Update account password
 * ***************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updatePassword error: " + error);
    return error;
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  checkExistingEmail,
  checkExistingPassword,
  getAccountById,
  updateAccountInfo,
  updatePassword,
};
