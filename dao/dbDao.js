const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/Proyect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos de MongoDB');
});


const cartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  products: [{ product: { type: String, required: true }, quantity: { type: Number, default: 1 } }],
});


const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  message: { type: String, required: true },
});


const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: [{ type: String }],
});


const Cart = mongoose.model('Cart', cartSchema);
const Message = mongoose.model('Message', messageSchema);
const Product = mongoose.model('Product', productSchema);

module.exports = { Cart, Message, Product };
