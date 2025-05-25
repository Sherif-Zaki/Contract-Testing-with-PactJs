const axios = require('axios');

const fetchSingleShirt = async (url, id) => {
  const response = await axios
    .get(`${url}/shirt/${id}`)
    .then((res) => res.data)
    .catch((err) => err.response);
  return response;
};

const addNewShirt = async (url, shirtName, shirtPrice, shirtQuantity) => {
  const data = {
    name: shirtName,
    price: shirtPrice,
    quantity: shirtQuantity
  };
  const response = await axios
    .post(`${url}/shirts`, data)
    .then((res) => res.data)
    .catch((err) => err.response.data.message);
  return response;
};

const updateShirt = async (url, id, shirtName, shirtPrice, shirtQuantity) => {
  const data = {
    name: shirtName,
    price: shirtPrice,
    quantity: shirtQuantity,
  };
  const response = await axios
      .put(`${url}/shirt/${id}`, data)
      .then((res) => res.data)
      .catch((err) => err.response.data.message);
  return response;
};

const deleteShirt = async (url, id) => {
  const response = await axios
      .delete(`${url}/shirt/${id}`)
      .then((res) => res.data.message)
      .catch((err) => err.response.data.message);
  return response;
};

module.exports = {
  fetchSingleShirt,
  addNewShirt,
  updateShirt,
  deleteShirt,
};

