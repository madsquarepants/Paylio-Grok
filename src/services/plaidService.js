const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

const fetchPlaidSubscriptions = async (userId) => {
  return [
    { id: 1, name: 'Plaid Mock Sub 1', amount: 12.99, status: 'active', user_id: userId },
    { id: 2, name: 'Plaid Mock Sub 2', amount: 8.99, status: 'active', user_id: userId },
  ];
};

module.exports = { fetchPlaidSubscriptions };