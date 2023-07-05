const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8080;

// Configuración del motor de plantillas Handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  // Implementar lógica de WebSocket
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const mongoose = require('mongoose');

// Establecer la conexión con la base de datos de MongoDB
mongoose.connect('mongodb+srv://EnzoSangui:remember71120@proyect.ry6mwfd.mongodb.net/Proyect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión con MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa con MongoDB');
});
