const cardsContainer = document.getElementById("cards-container");
const categoriesContainer = document.getElementById(
  "cards-categories-container"
);
const productoPrecioBusqueda = document.getElementById(
  "productoPrecioBusqueda"
);
const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const ivaPorcentaje = 0.16;
const productosEnTabla = [];
let subtotal = 0;

document.addEventListener("DOMContentLoaded", function () {
  barraBusquedaConsumo();
  cargarProductosDeCategoria(null);
});

fetch("http://localhost:3008/categorias", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0]);
    data.forEach((category) => {
      const categoryButton = createCategoryButton(category);
      categoriesContainer.appendChild(categoryButton);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las categorías:", error);
  });

cargarProductosDeCategoria();

function barraBusquedaConsumo() {
  fetch("http://localhost:3008/productos", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const datalist = document.getElementById("productos");
      datalist.innerHTML = "";
      data.forEach((product) => {
        const option = document.createElement("option");
        option.value = `${product.productoNombre} - ${product.productoPrecio}`;
        datalist.appendChild(option);
      });

      // Agregar un evento input a la barra de búsqueda para filtrar productos en cards
      const barraBusqueda = document.getElementById("productoPrecioBusqueda");
      barraBusqueda.addEventListener("input", filtrarProductosEnCards);
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
}

function filtrarProductosEnCards() {
  const barraBusqueda = document.getElementById("productoPrecioBusqueda");
  const valorBusqueda = barraBusqueda.value.toLowerCase();

  const cards = document.querySelectorAll(".card-producto");
  cards.forEach((card) => {
    const nombreProducto = card
      .querySelector(".nombre-producto")
      .textContent.toLowerCase();
    const categoriaProducto = card
      .querySelector(".categoria-producto")
      .textContent.toLowerCase();

    if (
      nombreProducto.includes(valorBusqueda) ||
      categoriaProducto.includes(valorBusqueda)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function cardTemplate(product) {
  // Utiliza la URL de la imagen directamente desde la base de datos
  const imageUrl = product.productoUrl;

  return `
  <div class="card-producto card" onclick="agregarDetalle('${product.productoNombre}', '${product.productoPrecio}')">
    <img src="${imageUrl}" class="card-img-top" style="height:300px" alt="Producto Imagen">
    <div class="card-product-content card-body">
      <p class="categoria-producto">${product.productoCategoria}</p>
      <p class="nombre-producto">${product.productoNombre}</p>
      <p class="precio-producto card-text">$${product.productoPrecio}</p>
    </div>
  </div>
  `;
}

function createCategoryButton(category) {
  const categoryId = category.value;
  const categoryDescription = category.text;

  const categoryButton = document.createElement("button");
  categoryButton.textContent = categoryDescription;
  categoryButton.classList.add("category-button");
  categoryButton.dataset.categoryId = categoryId;

  categoryButton.addEventListener("click", () => {
    console.log(`Categoría seleccionada: ${categoryDescription}`);

    cargarProductosDeCategoria(categoryId);
  });

  return categoryButton;
}

function cargarProductosDeCategoria(categoryId) {
  fetch("http://localhost:3008/productos", requestOptions)
    .then((response) => response.json())
    .then((productos) => {
      if (categoryId === null || categoryId === undefined) {
        productos.forEach((product) => {
          const card = document.createElement("div");
          card.className = "col-lg-3 col-md-6 col-sm-12";
          card.innerHTML = cardTemplate(product);
          cardsContainer.appendChild(card);
        });
      } else {
        const productosDeCategoria = productos.filter(
          (product) => product.productoCategoria === categoryId
        );

        cardsContainer.innerHTML = "";

        productosDeCategoria.forEach((product) => {
          const card = document.createElement("div");
          card.className = "col-lg-4 col-md-6 col-sm-12";
          card.innerHTML = cardTemplate(product);
          cardsContainer.appendChild(card);
        });
      }
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
}

function agregarDetalle(descripcion, precio, esPropina = false) {
  const productoExistente = productosEnTabla.find(
    (producto) => producto.descripcion === descripcion
  );

  if (productoExistente) {
    productoExistente.cantidad++;
    actualizarCantidadEnTabla(productoExistente);
  } else {
    const producto = {
      descripcion: descripcion,
      precio: precio,
      cantidad: 1,
    };

    productosEnTabla.push(producto);
    agregarProductoATabla(producto);
  }

  if (esPropina) {
    actualizarValoresConPropina(precio);
  } else {
    actualizarValores();
  }
}

function agregarProductoATabla(producto) {
  const detalleProducto = document.getElementById("detalleProducto");
  const tbody = detalleProducto.querySelector("tbody");
  const existingRow = Array.from(tbody.rows).find(
    (row) => row.dataset.descripcion === producto.descripcion
  );

  if (existingRow) {
    producto.cantidad++;
    actualizarCantidadEnTabla(producto);
  } else {
    const newRow = tbody.insertRow();
    const descripcionCell = newRow.insertCell(0);
    const precioCell = newRow.insertCell(1);

    descripcionCell.textContent = producto.descripcion;
    precioCell.textContent = `$${producto.precio}`;

    const aumentarCantidadBtn = document.createElement("button");
    aumentarCantidadBtn.textContent = "+";
    aumentarCantidadBtn.classList.add("btn-cantidad");
    aumentarCantidadBtn.addEventListener("click", () =>
      aumentarCantidad(producto)
    );

    const disminuirCantidadBtn = document.createElement("button");
    disminuirCantidadBtn.textContent = "-";
    disminuirCantidadBtn.classList.add("btn-cantidad");
    disminuirCantidadBtn.addEventListener("click", () =>
      disminuirCantidad(producto)
    );

    const cantidadCell = newRow.insertCell(2);
    cantidadCell.textContent = producto.cantidad;
    cantidadCell.classList.add("cantidad-cell");

    const aumentarCantidadCell = newRow.insertCell(3);
    aumentarCantidadCell.appendChild(aumentarCantidadBtn);

    const disminuirCantidadCell = newRow.insertCell(4);
    disminuirCantidadCell.appendChild(disminuirCantidadBtn);

    newRow.dataset.descripcion = producto.descripcion;
  }
}

function aumentarCantidad(producto) {
  producto.cantidad++;
  actualizarCantidadEnTabla(producto);
  actualizarValores();
}

function disminuirCantidad(producto) {
  if (producto.cantidad > 1) {
    producto.cantidad--;
    actualizarCantidadEnTabla(producto);
    actualizarValores();
  }
}

function actualizarCantidadEnTabla(producto) {
  const filas = document.querySelectorAll("#detalleProducto tbody tr");
  filas.forEach((fila) => {
    if (fila.dataset.descripcion === producto.descripcion) {
      const cantidadCell = fila.cells[2];
      cantidadCell.textContent = producto.cantidad;
    }
  });
}

function actualizarValores() {
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

function agregarPropina() {
  const montoPropinaInput = document.getElementById("montoPropina");
  const montoPropina = parseFloat(montoPropinaInput.value) || 0;

  if (montoPropina > 0) {
    agregarDetalle("Propina", montoPropina, true);

    $("#modalPropina").modal("hide");

    // Limpia el campo de monto de propina
    montoPropinaInput.value = "";
  }
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

function productoSelect() {
  const productoPrecioBusqueda = document.getElementById(
    "productoPrecioBusqueda"
  );
  const productoSeleccionado = productoPrecioBusqueda.value;

  if (descripcion && precio) {
    // Llamar a la función agregarDetalle con la descripción y el precio
    agregarDetalle(descripcion, parseFloat(precio));
  } else {
    console.error(
      "No se pudo obtener la descripción y el precio del producto seleccionado."
    );
  }
}
/*
function realizarPedido() {
  // Llena la tabla de detalles del pedido en el modal
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  const tbody = tablaSolicitud.querySelector("tbody");

  // Limpia el contenido existente en la tabla de detalles
  tbody.innerHTML = "";

  // Itera a través de los productos en la orden
  productosEnTabla.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${producto.descripcion}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.cantidad}</td>
    `;
    tbody.appendChild(row);
  });

  // Calcula y muestra el subtotal y el total
  const subtotal = productosEnTabla.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );
  const iva = subtotal * 0.16; // 16% de IVA (puedes cambiar esto según tus necesidades)
  const total = subtotal + iva;

  // Muestra el subtotal y el total en la tabla de resumen del pedido
  const resumenPedido = document.getElementById("resumenPedido");
  resumenPedido.innerHTML = `
    <tr>
      <td colspan="2"><strong>Subtotal:</strong></td>
      <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>IVA:</strong></td>
      <td>$${iva.toFixed(2)}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Total:</strong></td>
      <td>$${total.toFixed(2)}</td>
    </tr>
  `;

  // Abre el modal `aceptaVenta`
  $("#aceptaVenta").modal("show");
}

$("#confirmOrderModal").on("show.bs.modal", function (e) {
  llenarTablaConfirmacion();
});*/

// Función para construir la tabla de detalles en el modal
function construirTablaDetalles() {
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  tablaSolicitud.innerHTML = ""; // Limpia la tabla

  const detalleProducto = document.getElementById("detalleProducto");
  const filas = detalleProducto.querySelectorAll("tbody tr");

  if (filas.length === 0) {
    // No hay productos en la orden, muestra un mensaje
    tablaSolicitud.textContent = "No hay productos en la orden.";
  } else {
    // Crea la tabla de detalles
    const table = document.createElement("table");
    table.className = "table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Crea la fila de encabezado de la tabla
    const headerRow = document.createElement("tr");
    const thDescripcion = document.createElement("th");
    thDescripcion.textContent = "Descripción";
    const thPrecio = document.createElement("th");
    thPrecio.textContent = "Precio";
    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";
    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    headerRow.appendChild(thDescripcion);
    headerRow.appendChild(thPrecio);
    headerRow.appendChild(thCantidad);
    headerRow.appendChild(thTotal);
    thead.appendChild(headerRow);

    // Agrega filas a la tabla con los productos en la orden
    filas.forEach((fila) => {
      const descripcion = fila.cells[0].textContent;
      const precio = fila.cells[1].textContent;
      const cantidad = fila.cells[2].textContent;
      const row = document.createElement("tr");
      const tdDescripcion = document.createElement("td");
      tdDescripcion.textContent = descripcion;
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = precio;
      const tdCantidad = document.createElement("td");
      tdCantidad.textContent = cantidad;
      const thTotal = document.createElement("td");
      thTotal.textContent = totalConIvaYPropina;
      row.appendChild(tdDescripcion);
      row.appendChild(tdPrecio);
      row.appendChild(tdCantidad);
      row.appendChild(thTotal);
      tbody.appendChild(row);
      const totalConIvaYPropina = subtotalConPropina + ivaConPropina;
    });

    // Agrega la tabla al modal
    table.appendChild(thead);
    table.appendChild(tbody);
    tablaSolicitud.appendChild(table);
  }
}
/*
// Ahora, actualiza la función realizarPedido para que también llame a construirTablaDetalles
function realizarPedido() {
  // Llena la tabla de detalles del pedido en el modal
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  const tbody = tablaSolicitud.querySelector("tbody");

  // Limpia el contenido existente en la tabla de detalles
  tbody.innerHTML = "";

  // Itera a través de los productos en la orden
  productosEnTabla.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${producto.descripcion}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.cantidad}</td>
    `;
    tbody.appendChild(row);
  });

  // Calcula el subtotal y el total
  const subtotal = productosEnTabla.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );
  const total = subtotal + subtotal * 0.16; // Incluye el 16% de IVA (ajusta según tus necesidades)

  // Actualiza el contenido de las filas del subtotal y el total en la tabla
  const subtotalValue = document.getElementById("subtotalValue");
  const totalValue = document.getElementById("totalValue");
  subtotalValue.textContent = `$${subtotal.toFixed(2)}`;
  totalValue.textContent = `$${total.toFixed(2)}`;

  // Abre el modal `aceptaVenta`
  $("#aceptaVenta").modal("show");
}*/

function realizarPedido() {
  // Aquí puedes realizar la lógica de procesamiento del pedido
  // Construye una tabla con los detalles de la orden
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  tablaSolicitud.innerHTML = ""; // Limpia la tabla

  const detalleProducto = document.getElementById("detalleProducto");
  const filas = detalleProducto.querySelectorAll("tbody tr");

  if (filas.length === 0) {
    tablaSolicitud.textContent = "No hay productos en la orden.";
  } else {
    // Crea la tabla de detalles
    const table = document.createElement("table");
    table.className = "table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Crea la fila de encabezado de la tabla
    const headerRow = document.createElement("tr");
    const thDescripcion = document.createElement("th");
    thDescripcion.textContent = "Descripción";
    const thPrecio = document.createElement("th");
    thPrecio.textContent = "Precio";
    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";

    headerRow.appendChild(thDescripcion);
    headerRow.appendChild(thPrecio);
    headerRow.appendChild(thCantidad);
    thead.appendChild(headerRow);

    // Agrega filas a la tabla con los productos en la orden
    filas.forEach((fila) => {
      const descripcion = fila.cells[0].textContent;
      const precio = fila.cells[1].textContent;
      const cantidad = fila.cells[2].textContent;

      const row = document.createElement("tr");
      const tdDescripcion = document.createElement("td");
      tdDescripcion.textContent = descripcion;
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = precio;
      const tdCantidad = document.createElement("td");
      tdCantidad.textContent = cantidad;

      row.appendChild(tdDescripcion);
      row.appendChild(tdPrecio);
      row.appendChild(tdCantidad);
      tbody.appendChild(row);
    });

    // Agrega la tabla al modal
    table.appendChild(thead);
    table.appendChild(tbody);
    tablaSolicitud.appendChild(table);
  }
}

function realizarPedidoFinal() {
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  tablaSolicitud.innerHTML = ""; // Limpia la tabla

  const detalleProducto = document.getElementById("detalleProducto");
  const filas = detalleProducto.querySelectorAll("tbody tr");

  if (filas.length === 0) {
    // No hay productos en la orden, muestra un mensaje
    tablaSolicitud.textContent = "No hay productos en la orden.";
  } else {
    // Crea la tabla de detalles
    const table = document.createElement("table");
    table.className = "table";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Crea la fila de encabezado de la tabla
    const headerRow = document.createElement("tr");
    const thDescripcion = document.createElement("th");
    thDescripcion.textContent = "Descripción";
    const thPrecio = document.createElement("th");
    thPrecio.textContent = "Precio";
    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";
    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    headerRow.appendChild(thDescripcion);
    headerRow.appendChild(thPrecio);
    headerRow.appendChild(thCantidad);
    headerRow.appendChild(thTotal);
    thead.appendChild(headerRow);

    // Agrega filas a la tabla con los productos en la orden
    filas.forEach((fila) => {
      const descripcion = fila.cells[0].textContent;
      const precio = fila.cells[1].textContent;
      const cantidad = fila.cells[2].textContent;
      const row = document.createElement("tr");
      const tdDescripcion = document.createElement("td");
      tdDescripcion.textContent = descripcion;
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = precio;
      const tdCantidad = document.createElement("td");
      tdCantidad.textContent = cantidad;
      const tdTotal = document.createElement("td");
      tdTotal.textContent = `$${(
        parseFloat(precio) * parseInt(cantidad)
      ).toFixed(2)}`;
      row.appendChild(tdDescripcion);
      row.appendChild(tdPrecio);
      row.appendChild(tdCantidad);
      row.appendChild(tdTotal);
      tbody.appendChild(row);
    });

    // Agrega la tabla al modal
    table.appendChild(thead);
    table.appendChild(tbody);
    tablaSolicitud.appendChild(table);
  }

  // Abre el modal `realizarPedidoFinal`
  $("#aceptaVenta").modal("show");
}

function selectMes(numeroMesa) {
  document.getElementById("selectMesa").value = numeroMesa;
  document.getElementById("titulMesa").innerHTML = "Mesa-" + numeroMesa;
  $("#mesaDis").modal("hide");

  // Asignar el valor a numeroMesaSeleccionada
  numeroMesaSeleccionada = numeroMesa;
}

function insertarOrdenVenta() {
  // Obtener el monto de propina ingresado por el usuario
  const montoPropina = parseFloat(
    document.getElementById("montoPropina").value
  );

  // Datos del pedido
  const datosPedido = {
    total: parseFloat(
      document.getElementById("totalG").textContent.replace("$", "")
    ),
    subtotal: parseFloat(
      document.getElementById("subtotal").textContent.replace("$", "")
    ),
    iva: parseFloat(
      document.getElementById("ivas").textContent.replace("$", "")
    ),
    numeroMesa: parseInt(numeroMesaSeleccionada),
    propina: montoPropina,
  };

  // Enviar datos al servidor Node.js usando fetch
  fetch("http://localhost:3008/insertarOrdenVenta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosPedido),
  })
    .then((response) => response.json())
    .then((data) => {
      // Manejar la respuesta del servidor
      console.log(data);
    })
    .catch((error) => {
      console.error("Error al enviar los datos al servidor:", error);
    });
}

$(document).ready(function (e) {
  // Cierra el modal cuando se hace clic fuera de él
  $("#mesaDis").click(function (e) {
    if ($(e.target).is("#mesaDis")) {
      $("#mesaDis").modal("hide");
    }
  });

  // Cierra el modal cuando se pulsa la tecla "Escape"
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      $("#mesaDis").modal("hide");
    }
  });
});
