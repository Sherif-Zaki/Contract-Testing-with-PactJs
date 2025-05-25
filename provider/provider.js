const Joi = require('joi');
const express = require('express');
const Shirts = require('./shirts')

const server = express();
server.use(express.json());

const shirts = new Shirts();

// Load default data into the Shirts class
const importData = () => {
  const data = require('.././data/shirts.json');
  data.forEach(shirt => {
    // Do NOT set shirt.id here, let insertShirt handle it
    shirts.insertShirt(shirt);
  });
};


server.get('/shirt/:id', (req, res) => {
  const shirt = shirts.getShirtById(req.params.id);
  if (!shirt) {
    return res.status(404).send('Shirt does not exist.');
  }
  return res.status(200).send(shirt);
});

server.post('/shirts', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(2000).required(),
    price: Joi.number().min(0.99).max(1000).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) return res.status(400).send(result.error.details[0]);

  if (shirts.getShirtByName(req.body.name)) {
    return res.status(400).send(`Shirt ${req.body.name} already exists`);
  }

  const shirt = {
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  };

  shirts.insertShirt(shirt);
  return res.status(201).send(shirt);
});

server.put('/shirt/:id', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(2000).required(),
    price: Joi.number().min(0.99).max(1000).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const shirt = shirts.getShirtById(req.params.id);
  if (!shirt) {
    return res.status(404).send(`Shirt with id ${req.params.id} not found`);
  }

  shirt.name = req.body.name;
  shirt.quantity = req.body.quantity;
  shirt.price = req.body.price;

  return res.status(200).send(shirt);
});

server.delete('/shirt/:id', (req, res) => {
  const success = shirts.deleteShirt(req.params.id);
  if (!success) {
    return res.status(404).send(`Shirt ${req.params.id} not found`);
  }

  return res.status(204).send();
});

module.exports = {
  server,
  importData,
  shirts,
};
