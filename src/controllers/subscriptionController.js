const { getSubscriptions, updateSubscriptionStatus } = require('../models/subscriptionModel');
const { fetchPlaidSubscriptions } = require('../services/plaidService');
const { sendCancellationEmail } = require('../services/emailService');

const listSubscriptions = async (req, res) => {
  const userId = req.userId;
  try {
    let subscriptions = await getSubscriptions(userId);
    if (!subscriptions.length) {
      const plaidSubs = await fetchPlaidSubscriptions(userId);
      subscriptions = plaidSubs;
    }
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

const cancelSubscription = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    await updateSubscriptionStatus(id, userId, 'in_progress');
    await sendCancellationEmail(id, userId);
    setTimeout(async () => {
      await updateSubscriptionStatus(id, userId, 'success');
    }, 5000);
    res.json({ message: 'Cancellation in progress' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

module.exports = { listSubscriptions, cancelSubscription };