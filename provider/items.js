const { v4: uuidv4 } = require('uuid');

class Item {
  constructor() {
    this.items = [];
  }

  getItemById(id) {
    return this.items.find((item) => item.id === id);
  }

  getItemByName(name) {
    return this.items.find((item) => item.name === name);
  }

  insertItem(item) {
    if (!item.id) {
      item.id = uuidv4();
    }
    this.items.push(item);
  }

  deleteItem(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  getFirstItem() {
    return this.items[0];
  }
}

module.exports = Item;