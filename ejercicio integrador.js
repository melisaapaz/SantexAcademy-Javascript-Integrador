/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku

El código tiene errores y varias cosas para mejorar / agregar
*/

// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

const singularOPlural = (cantidad) => {
    if (cantidad === 1) {
      return `Se eliminó ${cantidad} unidad`;
    } else {
      return `Se eliminaron ${cantidad} unidades`;
    }
  }

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);
        try {
            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);
            console.log("Producto encontrado", producto);
            // Busco el producto en el carrito
            let productoExistente = this.productos.find(producto => producto.sku === sku);

            if (productoExistente) {
                // Si el producto ya existe, actualizo la cantidad 
                console.log("Actualizando cantidad del producto", producto);
                productoExistente.cantidad += cantidad;
            } else {
                    // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);       

                // Verifico si la categoría ya está en la lista de categorías del carrito
                if (!this.categorias.includes(producto.categoria)) {
                // Si la categoría no está en la lista, la agrego
                    this.categorias.push(producto.categoria);
                }
            }   

            this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            //Investigue la callback "reduce", pero no me funciona
            }
        catch (error) {
                const mensaje = "Error: " + error
                console.log(`%c${mensaje}`, "font-weight: bold; color: red;");
            }      
    }

    //2) Agregar la función eliminarProducto a la clase Carrito
        //a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
        //b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
        //c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
        //d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
        //e) La función debe retornar una promesa

        //Obs.: Si no coloco un setTimeout en éste método, no puedo utilizarlo. ¿Es correcto lo que hice? 
    eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {     
            setTimeout(() => {
                    // Busco el producto en el carrito a través de la posición en el array de productos
                    // para luego re utilizarlo si se ejecuta un splice
                    const posicionDelProducto = this.productos.findIndex(p => p.sku === sku);
      
                    if (posicionDelProducto === -1) {
                        reject(new Error(`El producto ${sku} que desea eliminar no se encuentra en el carrito. Verifique...`));
                        return;
                    }
                    else
                    {
                        const producto = this.productos[posicionDelProducto];
                        //console.log("Por eliminar " + producto.nombre + ' con cantidad ' + producto.cantidad)
                            if (cantidad >= producto.cantidad) {
                                this.productos.splice(posicionDelProducto, 1);
                                resolve(`Se eliminó el producto ${producto.nombre} del carrito`);
                                return;
                            } 
                            else {
                                producto.cantidad -= cantidad;            
                                resolve(singularOPlural(cantidad) + ` del producto ${producto.nombre} del carrito`);
                                return;
                            }
                    }
                }, 3000);           
        });
      }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Producto ${sku} no encontrado`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();
/*Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.*/

//Validación de actualización de cantidades en el carrito
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);
//Validación de producto inexistente
carrito.agregarProducto('MELISA', 8);
console.log(carrito)

//3) Utilizar la función eliminarProducto utilizando .then() y .catch()
//*******************************************************************/

//Validación de producto inexistente
const resultadoDeEliminar = carrito.eliminarProducto('WE328fNJ', 1)

//Validación cantidad < a producto.cantidad
//const resultadoDeEliminar = carrito.eliminarProducto('WE328NJ', 1)

//Validación cantidad >= a producto.cantidad
//const resultadoDeEliminar = carrito.eliminarProducto('WE328NJ', 20)

resultadoDeEliminar.then((resultado) => {
    console.log(resultado); 
  }).catch((error) => {
    console.log(`%c${error}`, "font-weight: bold; color: red;");
  });

  