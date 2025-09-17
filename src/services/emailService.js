const sendCancellationEmail = async (subscriptionId, userId) => {
  console.log(`Mock email sent for subscription ${subscriptionId} to user ${userId}`);
};

module.exports = { sendCancellationEmail };