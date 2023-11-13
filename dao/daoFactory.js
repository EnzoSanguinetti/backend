
const ProductDAO = require('../routes/products'); 
const CartDAO = require('../routes/carts'); 

class DAOFactory {
  static createDAO(type) {
    if (type === 'products') {
      return new ProductDAO(); 
    } else if (type === 'carts') {
      return new CartDAO(); 
    } else {
      throw new Error('Tipo de DAO no válido');
    }
  }
}

module.exports = DAOFactory;
