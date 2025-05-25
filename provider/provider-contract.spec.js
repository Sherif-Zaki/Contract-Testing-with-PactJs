const { Verifier } = require('@pact-foundation/pact');
const { importData, items, server } = require('./provider')
 
const port = '3001';
const app = server.listen(port, () => console.log(`Listening on port ${port}...`));
 
importData();

const options = {
  provider: 'ItemsAPI',
  providerBaseUrl: `http://localhost:${port}`,
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersion: '1.0.0',
  publishVerificationResult: true,
  consumerVersionTags: ['main'],
  stateHandlers: {
    'Has an item with specific ID': (parameters) => {
      return new Promise((resolve) => {
        // Clear all items first (optional, to have a clean state)
        items.items.length = 0;
        items.insertItem({
          id: parameters.id,
          name: "My item",
          price: 19.99,
          quantity: 1,
        });
        resolve(`Item with ID ${parameters.id} is available for testing.`);
      });
    }
  }
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of item-consumer', () => {
    return verifier
      .verifyProvider()
      .then(output => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
        app.close();
      })
  });
});