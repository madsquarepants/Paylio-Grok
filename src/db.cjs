
const { Pool } = require("pg");

// DB is enabled only if DISABLE_DB!=true AND DATABASE_URL exists
const isDbEnabled =
  String(process.env.DISABLE_DB || "").toLowerCase() !== "true" &&
  !!process.env.DATABASE_URL;

const pool = isDbEnabled
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        String(process.env.DATABASE_SSL || "").toLowerCase() === "true"
          ? { rejectUnauthorized: false }
          : false,
      max: 5,
      idleTimeoutMillis: 30000,
    })
  : null;

function requireDb(_req, res, next) {
  if (isDbEnabled) return next();
  return res
    .status(503)
    .json({ error: "Database is disabled in this environment" });
}

if (!isDbEnabled) {
  console.log("➡️  DB disabled: running with in-memory/no-DB mode");
}

module.exports = { pool, isDbEnabled, requireDb };
