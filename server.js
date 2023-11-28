const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');


app.use('/admin', adminRoutes);



newTicket.save((err, ticket) => {
  if (err) {
  
    console.error('Error al guardar el Ticket:', err);
  } else {
 
    console.log('Ticket guardado exitosamente:', ticket);
  }
});

const currentRoutes = require('./routes/current');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/carts');

app.use('/current', currentRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.use(express.json());


app.use('/api/products', productsRouter);


app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
});


server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://EnzoSangui:remember71120@proyect.ry6mwfd.mongodb.net/Proyect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión con MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa con MongoDB');
});

const daoFactory = require('./dao/daoFactory');

const daoType = process.argv[2];

const dao = daoFactory.createDAO(daoType);

const express = require('express');
const Product = require('./routes/products');
const Cart = require('./routes/carts');
const Ticket = require('./ticketModel');

// Ruta para finalizar el proceso de compra de un carrito
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;

  try {
    
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

   
    const productsToPurchase = cart.products;

    for (const productToPurchase of productsToPurchase) {
      const productId = productToPurchase.product._id;
      const requestedQuantity = productToPurchase.quantity;

      // Obtener el producto por su ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      // Verificar si hay suficiente stock para la cantidad solicitada
      if (product.stock >= requestedQuantity) {
        
        product.stock -= requestedQuantity;
        await product.save();
      } else {
        
        return res.status(400).json({ success: false, error: 'Stock insuficiente para el producto ' + product.title });
      }
    }

    // Generar el Ticket
    const totalAmount = cart.products.reduce((total, product) => total + product.price, 0);
    const purchaserEmail = purchaserEmail;

    const newTicket = new Ticket({
      code: 71120,
      amount: totalAmount,
      purchaser: purchaserEmail,
    });

    
    const savedTicket = await newTicket.save();

    
    cart.products = [];
    await cart.save();

    res.status(200).json({ success: true, ticket: savedTicket });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ success: false, error: 'Error al procesar la compra' });
  }
});

module.exports = router;



const express = require('express');
const Product = require('./routes/products');
const Cart = require('./routes/carts');
const TicketService = require('./ticketModel'); 

// Ruta para finalizar el proceso de compra de un carrito
router.post('/:cid/purchase', async (req, res) => {
  const cartId = req.params.cid;

  try {
    
    const cart = await Cart.findById(cartId).populate('products.product');

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    
    const productsToPurchase = cart.products;
    const productsNotProcessed = []; 

    for (const productToPurchase of productsToPurchase) {
      const productId = productToPurchase.product._id;
      const requestedQuantity = productToPurchase.quantity;

      // Obtener el producto por su ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      
      if (product.stock >= requestedQuantity) {
        
        product.stock -= requestedQuantity;
        await product.save();
      } else {
       
        productsNotProcessed.push(productId);
      }
    }

    // Generar el Ticket
    const ticketService = new TicketService(); 
    const ticketData = {
      code: 71120,
      amount: totalAmount,
      purchaser: purchaserEmail,
    };

    const ticketResult = await ticketService.generateTicket(ticketData);

    
    cart.products = [];
    await cart.save();

    
    const productsNotProcessedSet = new Set(productsNotProcessed);
    cart.products = cart.products.filter(product => !productsNotProcessedSet.has(product.product));

    
    await cart.save();

    
    res.status(200).json({
      success: true,
      ticket: ticketResult,
      productsNotProcessed: Array.from(productsNotProcessedSet),
    });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ success: false, error: 'Error al procesar la compra' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const Product = require('./routes/products');
const sendProductDeletedEmail = require('../utils/emailService'); 

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Verificar si el producto está asociado a un usuario premium
    if (product.premiumUserId) {
      // Enviar correo al usuario premium indicando que el producto fue eliminado
      sendProductDeletedEmail(product.premiumUserId, product.title);
    }

    // Eliminar el producto
    await product.remove();

    res.status(200).json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar producto' });
  }
});

module.exports = router;
