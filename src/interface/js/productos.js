const cardsContainer = document.getElementById("cards-container");
const categoriesContainer = document.getElementById(
  "cards-categories-container"
);
const productoPrecioBusqueda = document.getElementById(
  "productoPrecioBusqueda"
);

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

let productosEnTabla = [];
let subtotal = 0;
const ivaPorcentaje = 0.16;

document.addEventListener("DOMContentLoaded", function () {
  barraBusquedaConsumo();
});

function barraBusquedaConsumo() {
  fetch(
    "https://www.ta1.mx/apiPlebes/tacts/ubicacion/apiPlebesProductos",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const datalist = document.getElementById("productos");
      datalist.innerHTML = ""; // Limpia el datalist

      // Itera sobre los productos y agrega opciones al datalist
      data.forEach((product) => {
        const option = document.createElement("option");
        option.value = `${product.productoNombre} - ${product.productoPrecio}`;
        datalist.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
}



function cardTemplate(product, fileName) {
  const imageUrl = `https://www.ta2.mx/imgPlebes/${fileName}`;
  const imageTag = new Image();
  imageTag.onerror = function () {
    //this.src = "../../assets/img/error_picture.jpg";
  };

  imageTag.src = imageUrl;

  return `
  <div class="card-producto card" onclick="agregarDetalle('${product.productoNombre}', '${product.productoPrecio}')">
  <img src="${imageUrl}" class="card-img-top" style="height:300px" alt="Producto Imagen">
  <div class="card-product-content card-body">
  <p class="nombre-producto">${product.productoCategoria}</p>

    <p class="nombre-producto">${product.productoNombre}</p>
    <p class="precio-producto card-text">$${product.productoPrecio}</p>
  </div>
</div>
  `;
}

// Esta función carga productos de una categoría específica
function cargarProductosDeCategoria(categoryId) {
  // Realiza una solicitud para obtener los productos de la categoría seleccionada
  fetch(
    "https://www.ta1.mx/apiPlebes/tacts/ubicacion/apiPlebesProductos",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); //datos de categoría consumidos de la API del web service
      // Filtra los productos que pertenecen a la categoría seleccionada
      const productosDeCategoria = data.filter(
        (product) => product.TCAT_ID === categoryId
      );

      // Limpia el contenedor actual de tarjetas de productos
      cardsContainer.innerHTML = "";

      // Itera sobre los productos de la categoría y crea tarjetas
      productosDeCategoria.forEach((product) => {
        const fileName = product.productoUrl.split("/").pop();

        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6 col-sm-12";

        card.innerHTML = cardTemplate(product, fileName);

        cardsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los productos de la categoría:", error);
    });
}

function createCategoryButton(category) {
  const categoryId = category.TCAT_ID;
  const categoryDescription = category.TCTA_DESC;

  const categoryButton = document.createElement("button");
  categoryButton.textContent = categoryDescription;
  categoryButton.classList.add("category-button");
  categoryButton.dataset.categoryId = categoryId;

  categoryButton.addEventListener("click", () => {
    console.log(`Categoría seleccionada: ${categoryDescription}`);
    // Aquí puedes realizar acciones cuando se hace clic en una categoría.
    // Por ejemplo, cargar productos de esta categoría.
    cargarProductosDeCategoria(categoryId);
  });

  return categoryButton;
}


fetch(
  "https://www.ta1.mx/apiPlebes/tacts/ubicacion/apiPlebesCategoria",
  requestOptions
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data); //datos de categoría consumidos de la API del web service
    // Iterar sobre los datos de categoría y crear botones
    data.forEach((category) => {
      const categoryButton = createCategoryButton(category);
      categoriesContainer.appendChild(categoryButton);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las categorías:", error);
  });
cargarProductosDeCategoria();



// Función para agregar un producto a la tabla de detalles
function agregarDetalle(descripcion, precio) {
  // Verificar si el producto ya está en la tabla
  const productoExistente = productosEnTabla.find(
    (producto) => producto.descripcion === descripcion
  );

  if (productoExistente) {
    // Si el producto ya existe, aumentar su cantidad en la tabla
    productoExistente.cantidad++;
    actualizarCantidadEnTabla(productoExistente);
  } else {
    // Si el producto no existe, agregarlo a la tabla
    const producto = {
      descripcion: descripcion,
      precio: precio,
      cantidad: 1,
    };

    productosEnTabla.push(producto);
    agregarProductoATabla(producto);
  }

  actualizarValores();
}



function agregarDetalleBarraBusqueda(descripcion, precio) {
  const productoExistente = productosEnTabla.find(
    (producto) => producto.descripcion === descripcion
  );

  if (productoExistente) {
    // Si el producto ya existe, aumentar su cantidad en la tabla
    productoExistente.cantidad++;
    actualizarCantidadEnTabla(productoExistente);
  } else {
    // Si el producto no existe, agregarlo a la tabla
    const producto = {
      descripcion: descripcion,
      precio: precio,
      cantidad: 1,
    };

    productosEnTabla.push(producto);
    agregarProductoATabla(producto);
  }

  actualizarValores();
}

// Función para agregar un producto a la tabla de detalles
function agregarProductoATabla(producto) {
  // Obtener la tabla y el cuerpo de la tabla
  const detalleProducto = document.getElementById("detalleProducto");
  const tbody = detalleProducto.querySelector("tbody");

  // Crear una nueva fila
  const newRow = tbody.insertRow();

  // Crear celdas para descripción, precio, cantidad y botones de aumentar/disminuir
  const descripcionCell = newRow.insertCell(0);
  const precioCell = newRow.insertCell(1);
  const cantidadCell = newRow.insertCell(2);

  // Asignar valores a las celdas
  descripcionCell.textContent = producto.descripcion;
  precioCell.textContent = `$${producto.precio}`;
  cantidadCell.textContent = producto.cantidad;

  newRow.dataset.descripcion = producto.descripcion; // Almacena la descripción como atributo personalizado
}

// Función para actualizar la cantidad en la tabla de detalles
function actualizarCantidadEnTabla(producto) {
  // Buscar la fila correspondiente al producto por su descripción
  const filas = document.querySelectorAll("#detalleProducto tbody tr");
  filas.forEach((fila) => {
    if (fila.dataset.descripcion === producto.descripcion) {
      const cantidadCell = fila.cells[2];
      cantidadCell.textContent = producto.cantidad;
    }
  });
}

function disminuirCantidad(button) {
  const cantidadCell = button.parentNode.nextElementSibling;
  let cantidad = parseInt(cantidadCell.textContent);
  if (cantidad > 1) {
    cantidad--;
    cantidadCell.textContent = cantidad;
    actualizarValores();
  }
}

function aumentarCantidad(button) {
  const cantidadCell = button.parentNode.previousElementSibling;
  let cantidad = parseInt(cantidadCell.textContent);
  cantidad++;
  cantidadCell.textContent = cantidad;
  actualizarValores();
}

function actualizarValores() {
  // Actualizar el subtotal, IVA y total
  subtotal = 0;
  const filas = document.querySelectorAll("#detalleProducto tbody tr");
  filas.forEach((fila) => {
    const precio = parseFloat(fila.cells[1].textContent.replace("$", ""));
    const cantidad = parseInt(fila.cells[2].textContent);
    subtotal += precio * cantidad;
  });

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;

  const iva = subtotal * ivaPorcentaje;
  document.getElementById("ivas").textContent = `$${iva.toFixed(2)}`;

  const totalConIva = subtotal + iva;
  document.getElementById("totalG").textContent = `$${totalConIva.toFixed(2)}`;
}

const propinaInput = document.getElementById("propinaInput");
const totalPropinaSpan = document.getElementById("totalPropina");

// Función para calcular la propina y actualizar los valores
function addPropina() {
  $("#modalPropina").modal("show");
  document.getElementById("montoPropina").focus(); //totalG
  // Obtén el valor de la propina ingresado por el usuario
  const propina = parseFloat(propinaInput.value);

  // Actualiza el span que muestra la propina
  totalPropinaSpan.textContent = `$${propina.toFixed(2)}`;

  // Actualiza los valores de subtotal, IVA y total incluyendo la propina
  actualizarValoresConPropina(propina);
}

// Función para actualizar los valores incluyendo la propina
function actualizarValoresConPropina(propina) {
  // Calcula el subtotal incluyendo la propina
  const subtotalConPropina = subtotal + propina;
  document.getElementById(
    "subtotal"
  ).textContent = `$${subtotalConPropina.toFixed(2)}`;

  // Calcula el IVA y el total con la propina
  const ivaConPropina = subtotalConPropina * ivaPorcentaje;
  document.getElementById("ivas").textContent = `$${ivaConPropina.toFixed(2)}`;

  const totalConIvaYPropina = subtotalConPropina + ivaConPropina;
  document.getElementById(
    "totalG"
  ).textContent = `$${totalConIvaYPropina.toFixed(2)}`;
}


// Función para crear un botón de categoría


function productoSelect() {
  
  const productoPrecioBusqueda = document.getElementById(
    "productoPrecioBusqueda"
  );
  console.log(productoPrecioBusqueda);
  const productoSeleccionado = productoPrecioBusqueda.value;

  // Expresión regular para buscar el precio
  const regex = / -\$ (\d+)/;
  const match = productoSeleccionado.match(regex);

  if (match) {
    // El precio se encuentra en match[1]

    const precio = match[1];
    console.log("Precio:", precio);

    document.getElementById(
      "productoPrecioBusqueda"
    ).textContent = `Precio: $${precio}`;
  } else {
    document.getElementById("productoPrecioBusqueda").textContent =
      "Precio no encontrado en la cadena.";
  }
  console.log(precio);
}

function obtenerPrecio(valor) {
  console.log("----nn1" + valor);
  var arrayDeCadenas = valor.split("..-");
  const textos = arrayDeCadenas[0];
  console.log(textos);
  //document.getElementById('barraBusqueda');
  //console.log(document.getElementById('barraBusqueda').value);
}
