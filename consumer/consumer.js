const axios = require('axios');

const fetchSingleItem = async (url, id) => {
  const response = await axios
    .get(`${url}/item/${id}`)
    .then((res) => res.data)
    .catch((err) => err.response);
  return response;
};

const addNewItem = async (url, itemName, itemPrice, itemQuantity) => {
  const data = {
    name: itemName,
    price: itemPrice,
    quantity: itemQuantity
  };
  const response = await axios
    .post(`${url}/items`, data)
    .then((res) => res.data)
    .catch((err) => err.response.data.message);
  return response;
};

const updateItem = async (url, id, itemName, itemPrice, itemQuantity) => {
  const data = {
    name: itemName,
    price: itemPrice,
    quantity: itemQuantity,
  };
  const response = await axios
      .put(`${url}/item/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data.message);
  return response;
};

const deleteItem = async (url, id) => {
  const response = await axios
      .delete(`${url}/item/${id}`)
      .then((res) => res.data.message)
      .catch((err) => err.response.data.message);
  return response;
};

module.exports = {
  fetchSingleItem,
  addNewItem,
  updateItem,
  deleteItem,
};

