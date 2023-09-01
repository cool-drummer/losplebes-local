

function productoSelect() {
  // Obtener el valor seleccionado en el input
  const productoPrecioBusqueda = document.getElementById("productoPrecioBusqueda");
  const productoSeleccionado = productoPrecioBusqueda.value;

  // Expresión regular para buscar el precio
  const regex = / -\$ (\d+)/;
  const match = productoSeleccionado.match(regex);

  if (match) {
    // El precio se encuentra en match[1]
    
    const precio = match[1];
    console.log("Precio:", precio);
   
    document.getElementById("productoPrecioBusqueda").textContent = `Precio: $${precio}`;
  } else {
    document.getElementById("productoPrecioBusqueda").textContent = "Precio no encontrado en la cadena.";
  }
console.log(precio);
}



function obtenerPrecio(valor){
  console.log('----nn1'+valor)
  var arrayDeCadenas = valor.split('..-');
  const textos = arrayDeCadenas[0];
  console.log(textos);
  //document.getElementById('barraBusqueda');
  //console.log(document.getElementById('barraBusqueda').value);
};
