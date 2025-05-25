const path = require('path');
const {
  fetchSingleItem,
  addNewItem,
  updateItem,
  deleteItem,
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
  provider: 'ItemsAPI',
});

const EXPECTED_BODY = {id: 'uuid-string-example-1234', name: "My item", price: 19.99, quantity: 1};

describe('Items Inventory', () => {

  describe('When a GET request is made to a specific item ID', () => {
    test('it should return a specific item', async () => {
      const testId = 'uuid-string-example-1234';
      EXPECTED_BODY.id = testId;

      provider
        .given('Has an item with specific ID', {id: testId})
        .uponReceiving('a request to a specific item')
        .withRequest({
          method: 'GET',
          path: `/item/${testId}`,
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
        const items = await fetchSingleItem(mockProvider.url, testId);
        expect(items).toEqual(EXPECTED_BODY);
      });
    });
  });

  describe('When a POST request is made to add a new item', () => {
    test('it should add the item and return it', async () => {
      const newItem = { name: 'New Item', price: 25.99, quantity: 10 };

      provider
        .uponReceiving('a request to add a new item')
        .withRequest({
          method: 'POST',
          path: '/items',
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: string(newItem.name),
            price: decimal(newItem.price),
            quantity: integer(newItem.quantity),
          }
        })
        .willRespondWith({
          status: 201,
          body: {
            id: string(EXPECTED_BODY.id),
            name: string(newItem.name),
            price: decimal(newItem.price),
            quantity: integer(newItem.quantity),
          }
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await addNewItem(mockProvider.url, newItem.name, newItem.price, newItem.quantity);
        expect(response).toEqual({
          id: EXPECTED_BODY.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
        });
      });
    });
  });

  describe('When a PUT request is made to update an item', () => {
    test('it should update the item and return it', async () => {
      const testId = EXPECTED_BODY.id;
      const updatedItem = { name: 'Updated Item', price: 29.99, quantity: 15 };

      provider
        .given('Has an item with specific ID', { id: testId })
        .uponReceiving('a request to update an item')
        .withRequest({
          method: 'PUT',
          path: `/item/${testId}`,
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: string(updatedItem.name),
            price: decimal(updatedItem.price),
            quantity: integer(updatedItem.quantity),
          }
        })
        .willRespondWith({
          status: 200,
          body: {
            id: string(testId),
            name: string(updatedItem.name),
            price: decimal(updatedItem.price),
            quantity: integer(updatedItem.quantity),
          }
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await updateItem(mockProvider.url, testId, updatedItem.name, updatedItem.price, updatedItem.quantity);
        expect(response).toEqual({
          id: testId,
          name: updatedItem.name,
          price: updatedItem.price,
          quantity: updatedItem.quantity,
        });
      });
    });
  });

  describe('When a DELETE request is made to delete an item', () => {
    test('it should delete the item and return confirmation', async () => {
      const testId = EXPECTED_BODY.id;

      provider
        .given('Has an item with specific ID', { id: testId })
        .uponReceiving('a request to delete an item')
        .withRequest({
          method: 'DELETE',
          path: `/item/${testId}`,
        })
        .willRespondWith({
          status: 204,
          body: '',
        });

      await provider.executeTest(async (mockProvider) => {
        const response = await deleteItem(mockProvider.url, testId);
        expect(response).toBeUndefined();
      });
    });
  });
});