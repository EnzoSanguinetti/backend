const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const port = 3000;
const productManager = new ProductManager();

// Cargar los productos desde el archivo
productManager.loadProductsFromFile();

// Endpoint para obtener los productos
app.get('/products', (req, res) => {
  const limit = req.query.limit; // Obtener el valor del parámetro de consulta '?limit'
  const products = productManager.getProducts(limit);
  res.json(products);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});