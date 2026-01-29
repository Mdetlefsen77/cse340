const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool;
// Configuration for connecting to Render.com database
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // How long to wait when connecting a new client
};

if (process.env.NODE_ENV == "development") {
  pool = new Pool(poolConfig);

  // Added for troubleshooting queries
  // during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        return res;
      } catch (error) {
        console.error("error in query", { text });
        throw error;
      }
    },
    // Export the pool itself for connect-pg-simple
    pool: pool,
  };
} else {
  pool = new Pool(poolConfig);
  module.exports = pool;
}
