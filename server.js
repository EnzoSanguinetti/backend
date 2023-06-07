const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080;

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Ruta para manejo de productos
const productsRouter = express.Router();
const productsFilePath = 'products.json';

// Listar todos los productos
productsRouter.get('/', (req, res) => {
  const limit = req.query.limit || 10; // Valor predeterminado de límite: 10
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    const products = JSON.parse(data).slice(0, limit);
    res.json(products);
  });
});

// Obtener un producto por su ID
productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  });
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const productId = uuidv4(); // Generar un nuevo ID único
  const newProduct = {
    id: productId,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al agregar el producto' });
    }
    const products = JSON.parse(data);
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al agregar el producto' });
      }
      res.json(newProduct);
    });
  });
});

// Actualizar un producto
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedFields = req.body;

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    products[productIndex] = { ...products[productIndex], ...updatedFields };
    fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
      }
      res.json(products[productIndex]);
    });
  });
});

// Eliminar un producto
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
    let products = JSON.parse(data);
    const updatedProducts = products.filter((p) => p.id !== productId);
    if (updatedProducts.length === products.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
      }
      res.json({ message: 'Producto eliminado correctamente' });
    });
  });
});

app.use('/api/products', productsRouter);

// Ruta para manejo de carritos
const cartsRouter = express.Router();
const cartsFilePath = 'carts.json';

// Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const cartId = uuidv4(); // Generar un nuevo ID único
  const newCart = {
    id: cartId,
    products: [],
  };

  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el carrito' });
    }
    const carts = JSON.parse(data);
    carts.push(newCart);
    fs.writeFile(cartsFilePath, JSON.stringify(carts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al crear el carrito' });
      }
      res.json(newCart);
    });
  });
});

// Listar los productos de un carrito
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  });
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  fs.readFile(cartsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex((c) => c.id === cartId);
    if (cartIndex === -1) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex((p) => p.product === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }
    fs.writeFile(cartsFilePath, JSON.stringify(carts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
      }
      res.json(cart.products);
    });
  });
});

app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
