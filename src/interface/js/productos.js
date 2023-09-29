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

const ivaPorcentaje = 0.16;
const productosEnTabla = [];
let subtotal = 0;

document.addEventListener("DOMContentLoaded", function () {
  barraBusquedaConsumo();
  cargarProductosDeCategoria(null);

});

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

function createCategoryButton(category) {
  const categoryId = category.TCAT_ID;
  const categoryDescription = category.TCTA_DESC;

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
  fetch(
    "https://www.ta1.mx/apiPlebes/tacts/ubicacion/apiPlebesProductos",
    requestOptions
  )
    .then((response) => response.json())
    .then((productos) => {
      if (categoryId === null || categoryId === undefined) {
        productos.forEach((product) => {
          const fileName = product.productoUrl.split("/").pop();
          const card = document.createElement("div");
          card.className = "col-lg-3 col-md-6 col-sm-12";
          card.innerHTML = cardTemplate(product, fileName);
          cardsContainer.appendChild(card);
        });
      } else {
        const productosDeCategoria = productos.filter(
          (product) => product.productoCategoria === categoryId
        );

        cardsContainer.innerHTML = "";

        productosDeCategoria.forEach((product) => {
          const fileName = product.productoUrl.split("/").pop();
          const card = document.createElement("div");
          card.className = "col-lg-4 col-md-6 col-sm-12";
          card.innerHTML = cardTemplate(product, fileName);
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

  // Dividir el valor en descripción y precio utilizando el formato " - "
  const [descripcion, precio] = productoSeleccionado.split(" - ");

  if (descripcion && precio) {
    // Llamar a la función agregarDetalle con la descripción y el precio
    agregarDetalle(descripcion, parseFloat(precio));
  } else {
    console.error(
      "No se pudo obtener la descripción y el precio del producto seleccionado."
    );
  }
}

function llenarTablaConfirmacion() {
  const confirmOrderTableBody = document.getElementById(
    "confirmOrderTableBody"
  );
  confirmOrderTableBody.innerHTML = ""; // Limpia la tabla

  productosEnTabla.forEach((producto) => {
    const newRow = confirmOrderTableBody.insertRow();
    newRow.innerHTML = `
      <td>${producto.descripcion}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.cantidad}</td>
      <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
    `;
  });

  const confirmSubtotal = document.getElementById("confirmSubtotal");
  const confirmIVA = document.getElementById("confirmIVA");
  const confirmTotal = document.getElementById("confirmTotal");

  confirmSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  confirmIVA.textContent = `$${(subtotal * ivaPorcentaje).toFixed(2)}`;
  confirmTotal.textContent = `$${(subtotal + subtotal * ivaPorcentaje).toFixed(
    2
  )}`;
}

$("#confirmOrderModal").on("show.bs.modal", function (e) {
  llenarTablaConfirmacion();
});

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

// Ahora, actualiza la función realizarPedido para que también llame a construirTablaDetalles
function realizarPedido() {
  const metodoPago = document.getElementById("pagoTipo").textContent;
  const mesaSeleccionada = document.getElementById("titulMesa").textContent;
  const subtotal = parseFloat(
    document.getElementById("subtotal").textContent.replace("$", "")
  );
  const iva = parseFloat(
    document.getElementById("ivas").textContent.replace("$", "")
  );
  const total = parseFloat(
    document.getElementById("totalG").textContent.replace("$", "")
  );

  const pedidoResumen = `
    Método de Pago: ${metodoPago}
    Mesa Seleccionada: ${mesaSeleccionada}
    Subtotal: $${subtotal.toFixed(2)}
    IVA: $${iva.toFixed(2)}
    Total: $${total.toFixed(2)}
  `;

  // Actualiza el contenido del elemento "resumenPedido" en el modal
  const resumenPedidoElement = document.getElementById("resumenPedido");
  resumenPedidoElement.textContent = pedidoResumen;

  // Llama a la función para construir la tabla de detalles en el modal
  construirTablaDetalles();

  // Abre o muestra el modal si no está abierto
  $("#aceptaVenta").modal("show");
}

function realizarPedidoFinal() {
  const tablaSolicitud = document.getElementById("tablaSolicitud");
  const resumenPedido = document.getElementById("resumenPedido");

  // Limpia la tabla de resumen antes de agregar los nuevos elementos
  resumenPedido.innerHTML = "";

  const filas = tablaSolicitud.querySelectorAll("tbody tr");
  filas.forEach((fila) => {
    const descripcion = fila.cells[0].textContent;
    const precio = fila.cells[1].textContent;
    const cantidad = fila.cells[2].textContent;

    // Agrega una fila adicional en la tabla de resumen para cada producto
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

    resumenPedido.appendChild(row);
  });

  // Aquí puedes realizar cualquier otra lógica de procesamiento del pedido
}

function tpago() {
  banderaTipoPago = !banderaTipoPago;
  if (banderaTipoPago) {
    btnTipoPago.innerHTML = `<i class="mr-2" aria-hidden="true">$</i> Efectivo`;
  } else {
    btnTipoPago.innerHTML = `<i class="fa fa-credit-card mr-2" aria-hidden="true"></i> Tarjeta`;
  }
}

function cobrar() {
  $("#aceptaVenta").modal("hide");
  cobrarNormal();
}



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
