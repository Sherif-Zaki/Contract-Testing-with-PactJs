const Joi = require('joi');
const express = require('express');
const Items = require('./items')

const server = express();
server.use(express.json());

const items = new Items();

// Load default data into the Items class
const importData = () => {
  const data = require('.././data/items.json');
  data.forEach(item => {
    items.insertItem(item);
  });
};


server.get('/item/:id', (req, res) => {
  const item = items.getItemById(req.params.id);
  if (!item) {
    return res.status(404).send('Item does not exist.');
  }
  return res.status(200).send(item);
});

server.post('/items', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(2000).required(),
    price: Joi.number().min(0.99).max(1000).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) return res.status(400).send(result.error.details[0]);

  if (items.getItemByName(req.body.name)) {
    return res.status(400).send(`Item ${req.body.name} already exists`);
  }

  const item = {
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  };

  items.insertItem(item);
  return res.status(201).send(item);
});

server.put('/item/:id', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).max(2000).required(),
    price: Joi.number().min(0.99).max(1000).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const item = items.getItemById(req.params.id);
  if (!item) {
    return res.status(404).send(`Item with id ${req.params.id} not found`);
  }

  item.name = req.body.name;
  item.quantity = req.body.quantity;
  item.price = req.body.price;

  return res.status(200).send(item);
});

server.delete('/item/:id', (req, res) => {
  const success = items.deleteItem(req.params.id);
  if (!success) {
    return res.status(404).send(`Item ${req.params.id} not found`);
  }

  return res.status(204).send();
});

module.exports = {
  server,
  importData,
  items,
};
