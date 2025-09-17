const pool = require('../config/db');

const seedSubscriptions = async (userId) => {
  const seedData = [
    { name: 'Netflix', amount: 15.99, status: 'active', user_id: userId },
    { name: 'Spotify', amount: 9.99, status: 'active', user_id: userId },
  ];
  for (const sub of seedData) {
    await pool.query(
      'INSERT INTO subscriptions (name, amount, status, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [sub.name, sub.amount, sub.status, sub.user_id]
    );
  }
};

const getSubscriptions = async (userId) => {
  const result = await pool.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
  return result.rows;
};

const updateSubscriptionStatus = async (id, userId, status) => {
  await pool.query('UPDATE subscriptions SET status = $1 WHERE id = $2 AND user_id = $3', [status, id, userId]);
};

module.exports = { seedSubscriptions, getSubscriptions, updateSubscriptionStatus };