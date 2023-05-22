const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync('./products.json', 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error reading products file:', error);
    }
  }

  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }
}

module.exports = ProductManager;