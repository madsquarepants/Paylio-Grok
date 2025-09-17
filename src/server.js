// src/server.js (CommonJS)
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { pool, isDbEnabled, requireDb } = require("./db.cjs");

// Your existing route modules (CommonJS)
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck first (so we can see it's alive)
app.get("/health", (_req, res) => res.json({ ok: true }));

// Mount routes (optionally gate writes with requireDb)
app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
// Or block these entirely without DB:
// app.use("/api/subscriptions", requireDb, subscriptionRoutes);

// Initialize schema ONLY if DB is enabled
if (isDbEnabled) {
  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL NOT NULL,
      status VARCHAR(50) NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `;
  pool
    .query(ddl)
    .then(() => console.log("Database initialized"))
    .catch((err) => console.error("DB init error:", err));
} else {
  console.log("Skipping DB initialization (DISABLE_DB=true or no DATABASE_URL)");
}

// Robust error logging so crashes don't go silent
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const PORT = process.env.PORT || 10000; // Render assigns PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
