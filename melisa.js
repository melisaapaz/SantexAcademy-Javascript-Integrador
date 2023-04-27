function sumaPrecios(total, p) {
    return total + (p.precio * p.cantidad);
}

this.productos.reduce(sumaPrecios, 0);

//De la fn de arriba, paso a:
const x = function(total, p) {return total + (p.precio * p.cantidad);}

//la función reduce() llama a sumaPrecios como su primer argumento y el valor inicial 0 como su segundo argumento.
this.productos.reduce(sumaPrecios, 0);


//De la fn de arriba
this.productos.reduce(function(total, p) {
    return total + (p.precio * p.cantidad);
}, 0);

//De la fn de arriba
this.productos.reduce((total, p) => total + (p.precio * p.cantidad), 0);