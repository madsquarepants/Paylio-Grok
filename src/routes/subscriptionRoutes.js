const express = require('express');
const { listSubscriptions, cancelSubscription } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, listSubscriptions);
router.post('/cancel/:id', authMiddleware, cancelSubscription);

module.exports = router;