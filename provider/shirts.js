const { v4: uuidv4 } = require('uuid');

class Shirt {
  constructor() {
    this.shirts = [];
  }

  getShirtById(id) {
    return this.shirts.find((shirt) => shirt.id === id);
  }

  getShirtByName(name) {
    return this.shirts.find((shirt) => shirt.name === name);
  }

  insertShirt(shirt) {
    if (!shirt.id) {
      shirt.id = uuidv4();
    }
    this.shirts.push(shirt);
  }

  deleteShirt(id) {
    const index = this.shirts.findIndex((shirt) => shirt.id === id);
    if (index === -1) return false;
    this.shirts.splice(index, 1);
    return true;
  }

  getFirstShirt() {
    return this.shirts[0];
  }
}

module.exports = Shirt;