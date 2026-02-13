const pool = require("../database/");

/* *****************************
 * Create a new test drive request
 * ***************************** */
async function createTestDriveRequest(
  inv_id,
  account_id,
  preferred_date,
  preferred_time,
  phone_number,
  additional_notes,
) {
  try {
    const sql =
      "INSERT INTO test_drive_requests (inv_id, account_id, preferred_date, preferred_time, phone_number, additional_notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    return await pool.query(sql, [
      inv_id,
      account_id,
      preferred_date,
      preferred_time,
      phone_number,
      additional_notes || null,
    ]);
  } catch (error) {
    console.error("Database Error - Create Test Drive Request:", error);
    throw error;
  }
}

/* *****************************
 * Get all test drive requests (for employees/admins)
 * ***************************** */
async function getAllTestDriveRequests() {
  try {
    const sql = `
      SELECT 
        tdr.request_id,
        tdr.request_date,
        tdr.preferred_date,
        tdr.preferred_time,
        tdr.phone_number,
        tdr.additional_notes,
        tdr.status,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        a.account_firstname,
        a.account_lastname,
        a.account_email
      FROM test_drive_requests tdr
      INNER JOIN inventory i ON tdr.inv_id = i.inv_id
      INNER JOIN account a ON tdr.account_id = a.account_id
      ORDER BY tdr.request_date DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Database Error - Get All Test Drive Requests:", error);
    throw error;
  }
}

/* *****************************
 * Get test drive requests by account_id
 * ***************************** */
async function getTestDriveRequestsByAccountId(account_id) {
  try {
    const sql = `
      SELECT 
        tdr.request_id,
        tdr.request_date,
        tdr.preferred_date,
        tdr.preferred_time,
        tdr.phone_number,
        tdr.additional_notes,
        tdr.status,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_image,
        i.inv_thumbnail
      FROM test_drive_requests tdr
      INNER JOIN inventory i ON tdr.inv_id = i.inv_id
      WHERE tdr.account_id = $1
      ORDER BY tdr.request_date DESC
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error(
      "Database Error - Get Test Drive Requests by Account:",
      error,
    );
    throw error;
  }
}

/* *****************************
 * Update test drive request status
 * ***************************** */
async function updateTestDriveStatus(request_id, status) {
  try {
    const sql =
      "UPDATE test_drive_requests SET status = $1 WHERE request_id = $2 RETURNING *";
    const result = await pool.query(sql, [status, request_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Database Error - Update Test Drive Status:", error);
    throw error;
  }
}

/* *****************************
 * Get test drive request by ID
 * ***************************** */
async function getTestDriveRequestById(request_id) {
  try {
    const sql = `
      SELECT 
        tdr.*,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        a.account_firstname,
        a.account_lastname,
        a.account_email
      FROM test_drive_requests tdr
      INNER JOIN inventory i ON tdr.inv_id = i.inv_id
      INNER JOIN account a ON tdr.account_id = a.account_id
      WHERE tdr.request_id = $1
    `;
    const result = await pool.query(sql, [request_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Database Error - Get Test Drive Request by ID:", error);
    throw error;
  }
}

module.exports = {
  createTestDriveRequest,
  getAllTestDriveRequests,
  getTestDriveRequestsByAccountId,
  updateTestDriveStatus,
  getTestDriveRequestById,
};
