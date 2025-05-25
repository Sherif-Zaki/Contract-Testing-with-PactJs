# Inventory API

A simple RESTful API for managing inventory items built with Node.js and Express.

## Running the Shirts API locally

Install dependencies
`npm i`

Run the movies API
`npm run start:provider`

## Running the tests

I am using [Pactflow](https://pactflow.io/) as my broker. To use Pactflow , register for their free developer plan and export your Pactflow Broker URL and API token:

```
export PACT_BROKER_URL=<PACT_BROKER_URL here>
export PACT_API_TOKEN=<API_TOKEN here>
```

Run the consumer tests:
`npm run test:web:consumer`

Publish the contract to your pact broker:
`npm run publish:pact`

Run the provider tests
`npm run test:provider`

