const path = require('path');
const {
  fetchSingleShirt,
  addNewShirt,
  updateShirt,
  deleteShirt,
} = require('./consumer');
const {PactV3, MatchersV3} = require('@pact-foundation/pact');

const {
  eachLike,
  integer,
  string,
  decimal,
} = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'WebConsumer',
  provider: 'ShirtsAPI',
});

const EXPECTED_BODY = {id: 'uuid-string-example-1234', name: "My shirt", price: 19.99, quantity: 1};

describe('Shirts Inventory', () => {

  describe('When a GET request is made to a specific shirt ID', () => {
    test('it should return a specific shirt', async () => {
      const testId = 'uuid-string-example-1234';
      EXPECTED_BODY.id = testId;

      provider
        .given('Has a shirt with specific ID', {id: testId})
        .uponReceiving('a request to a specific shirt')
        .withRequest({
          method: 'GET',
          path: `/shirt/${testId}`,
        })
        .willRespondWith({
          status: 200,
          body: {
            id: string(testId),
            name: string(EXPECTED_BODY.name),
            price: decimal(EXPECTED_BODY.price),
            quantity: integer(EXPECTED_BODY.quantity),
          }
        });

      await provider.executeTest(async mockProvider => {
        const shirts = await fetchSingleShirt(mockProvider.url, testId);
        expect(shirts).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a POST request is made to add a new shirt', () => {
    test('it should add the shirt and return it', async () => {
      const newShirt = { name: 'New Shirt', price: 25.99, quantity: 10 };

      provider
        .uponReceiving('a request to add a new shirt')
        .withRequest({
          method: 'POST',
          path: '/shirts',
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: string(newShirt.name),
            price: decimal(newShirt.price),
            quantity: integer(newShirt.quantity),
          }
        })
        .willRespondWith({
          status: 201,
          body: {
            id: string(EXPECTED_BODY.id),
            name: string(newShirt.name),
            price: decimal(newShirt.price),
            quantity: integer(newShirt.quantity),
          }
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await addNewShirt(mockProvider.url, newShirt.name, newShirt.price, newShirt.quantity);
        expect(response).toEqual({
          id: EXPECTED_BODY.id,
          name: newShirt.name,
          price: newShirt.price,
          quantity: newShirt.quantity,
        });
      });
    });
  });

  describe('When a PUT request is made to update a shirt', () => {
    test('it should update the shirt and return it', async () => {
      const testId = EXPECTED_BODY.id;
      const updatedShirt = { name: 'Updated Shirt', price: 29.99, quantity: 15 };

      provider
        .given('Has a shirt with specific ID', { id: testId })
        .uponReceiving('a request to update a shirt')
        .withRequest({
          method: 'PUT',
          path: `/shirt/${testId}`,
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: string(updatedShirt.name),
            price: decimal(updatedShirt.price),
            quantity: integer(updatedShirt.quantity),
          }
        })
        .willRespondWith({
          status: 200,
          body: {
            id: string(testId),
            name: string(updatedShirt.name),
            price: decimal(updatedShirt.price),
            quantity: integer(updatedShirt.quantity),
          }
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await updateShirt(mockProvider.url, testId, updatedShirt.name, updatedShirt.price, updatedShirt.quantity);
        expect(response).toEqual({
          id: testId,
          name: updatedShirt.name,
          price: updatedShirt.price,
          quantity: updatedShirt.quantity,
        });
      });
    });
  });

  describe('When a DELETE request is made to delete a shirt', () => {
    test('it should delete the shirt and return confirmation', async () => {
      const testId = EXPECTED_BODY.id;

      provider
        .given('Has a shirt with specific ID', { id: testId })
        .uponReceiving('a request to delete a shirt')
        .withRequest({
          method: 'DELETE',
          path: `/shirt/${testId}`,
        })
        .willRespondWith({
          status: 204,
          body: '',
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await deleteShirt(mockProvider.url, testId);
        expect(response).toBeUndefined();
      });
    });
  });
});