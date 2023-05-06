class Producto {
  constructor(id, nombre, precio) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
  }
}

class Inventario {
  constructor() {
    this.productos = [];
  }

  // devolvemos el array de productos.
  getProducts() {
    return this.productos;
  }

  //creamos un nuevo objeto Producto con los parámetros dados, lo agrega al array productos y devuelve la instancia de la clase.
  addProduct(id, nombre, precio) {
    const producto = new Producto(id, nombre, precio);
    this.productos.push(producto);
    return this;
  }

  //busca un objeto Producto, en el array productos, por su id y lo devuelve.
  getProductById(id) {
    const producto = this.productos.find((p) => p.id === id);
    return producto;
  }
}

const inventario = new Inventario();

const resultado = inventario
  .addProduct(1, "Producto 1", 10.99)
  .addProduct(2, "Producto 2", 20.99)
  .addProduct(3, "Producto 3", 30.99)
  .getProductById(2);

console.log(`El producto es: ${JSON.stringify(resultado)}`);
