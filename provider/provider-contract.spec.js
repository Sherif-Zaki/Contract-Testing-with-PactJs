const { Verifier } = require('@pact-foundation/pact');
const { importData, shirts, server } = require('./provider')
 
const port = '3001';
const app = server.listen(port, () => console.log(`Listening on port ${port}...`));
 
importData();

const options = {
  provider: 'ShirtsAPI',
  providerBaseUrl: `http://localhost:${port}`,
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersion: '1.0.0',
  publishVerificationResult: true,
  consumerVersionTags: ['main'],
  stateHandlers: {
    'Has a shirt with specific ID': (parameters) => {
      return new Promise((resolve) => {
        // Clear all shirts first (optional, to have a clean state)
        shirts.shirts.length = 0;
        shirts.insertShirt({
          id: parameters.id,
          name: "My shirt",
          price: 19.99,
          quantity: 1,
        });
        resolve(`Shirt with ID ${parameters.id} is available for testing.`);
      });
    }
  }
};

const verifier = new Verifier(options);

describe('Pact Verification', () => {
  test('should validate the expectations of movie-consumer', () => {
    return verifier
      .verifyProvider()
      .then(output => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
        app.close();
      })
  });
});