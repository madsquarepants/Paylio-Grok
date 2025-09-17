import pg from "pg";
const { Pool } = pg;

export const isDbEnabled =
  String(process.env.DISABLE_DB || "").toLowerCase() !== "true" &&
  !!process.env.DATABASE_URL;

export const pool = isDbEnabled
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

export function requireDb(_req, res, next) {
  if (isDbEnabled) return next();
  return res
    .status(503)
    .json({ error: "Database is disabled in this environment" });
}

if (!isDbEnabled) {
  console.log("➡️  DB disabled: running with in-memory/no-DB mode");
}
