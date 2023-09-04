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
  cargarCategorias(); // Cargar categorías al inicio
  cargarProductosDeCategoria(null); // Cargar todos los productos al inicio
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
    console.log(data);
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
      console.log(data);

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

    // Comprueba si el nombre del producto o la categoría coinciden con la búsqueda
    if (
      nombreProducto.includes(valorBusqueda) ||
      categoriaProducto.includes(valorBusqueda)
    ) {
      card.style.display = "block"; // Muestra el card si coincide
    } else {
      card.style.display = "none"; // Oculta el card si no coincide
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
    // Aquí puedes realizar acciones cuando se hace clic en una categoría.
    // Por ejemplo, cargar productos de esta categoría.
    cargarProductosDeCategoria(categoryId);
  });

  return categoryButton;
}

function cargarProductosDeCategoria(categoryId) {
  // Realiza una solicitud para obtener los productos desde la API
  fetch(
    "https://www.ta1.mx/apiPlebes/tacts/ubicacion/apiPlebesProductos",
    requestOptions
  )
    .then((response) => response.json())
    .then((productos) => {
      console.log(productos);

      // Si categoryId es null o undefined, mostrar todos los productos
      if (categoryId === null || categoryId === undefined) {
        // Mostrar todos los productos
        productos.forEach((product) => {
          // Crea y agrega las tarjetas de producto como se hacía antes
          const fileName = product.productoUrl.split("/").pop();
          const card = document.createElement("div");
          card.className = "col-lg-4 col-md-6 col-sm-12";
          card.innerHTML = cardTemplate(product, fileName);
          cardsContainer.appendChild(card);
        });
      } else {
        // Filtra los productos que pertenecen a la categoría seleccionada
        const productosDeCategoria = productos.filter(
          (product) => product.productoCategoria === categoryId
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
      }
    })
    .catch((error) => {
      console.error("Error al obtener los productos:", error);
    });
}

function agregarDetalle(descripcion, precio, esPropina = false) {
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

  // Si es una propina, actualiza el total de la tabla
  if (esPropina) {
    actualizarValoresConPropina(precio);
  } else {
    actualizarValores();
  }
}

function agregarProductoATabla(producto) {
  // Obtener la tabla y el cuerpo de la tabla
  const detalleProducto = document.getElementById("detalleProducto");
  const tbody = detalleProducto.querySelector("tbody");

  // Crear una nueva fila
  const newRow = tbody.insertRow();

  // Crear celdas para descripción, precio, cantidad y botones de aumentar/disminuir
  const descripcionCell = newRow.insertCell(0);
  const precioCell = newRow.insertCell(1);

  // Asignar valores a las celdas
  descripcionCell.textContent = producto.descripcion;
  precioCell.textContent = `$${producto.precio}`;

  // Agregar los botones de aumentar y disminuir cantidad a la fila de la tabla
  const aumentarCantidadBtn = document.createElement("button");
  aumentarCantidadBtn.textContent = "+";
  aumentarCantidadBtn.classList.add("btn-cantidad");
  aumentarCantidadBtn.addEventListener("click", () => aumentarCantidad(producto));

  const disminuirCantidadBtn = document.createElement("button");
  disminuirCantidadBtn.textContent = "-";
  disminuirCantidadBtn.classList.add("btn-cantidad");
  disminuirCantidadBtn.addEventListener("click", () => disminuirCantidad(producto));

  const cantidadCell = newRow.insertCell(2); // Celda de cantidad
  cantidadCell.textContent = producto.cantidad;
  cantidadCell.classList.add("cantidad-cell");

  const aumentarCantidadCell = newRow.insertCell(3); // Celda de aumento
  aumentarCantidadCell.appendChild(aumentarCantidadBtn);

  const disminuirCantidadCell = newRow.insertCell(4); // Celda de disminución
  disminuirCantidadCell.appendChild(disminuirCantidadBtn);

  newRow.dataset.descripcion = producto.descripcion; // Almacena la descripción como atributo personalizado
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

// Función para calcular la propina y actualizar los valores

function agregarPropina() {
  const montoPropinaInput = document.getElementById("montoPropina");
  const montoPropina = parseFloat(montoPropinaInput.value) || 0; // Obtener el monto de propina ingresado

  if (montoPropina > 0) {
    // Agregar la propina a la tabla
    agregarDetalle("Propina", montoPropina, true);

    // Cierra el modal de propina
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
