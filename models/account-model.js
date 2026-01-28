const pool = require("../database/");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        console.error('Database Error Details:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            constraint: error.constraint
        });
        throw error;
    }
}

async function lognAccount(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const result = await pool.query(sql, [account_email]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error Details:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            constraint: error.constraint
        });
        throw error;
    }
}

module.exports = { registerAccount, lognAccount };