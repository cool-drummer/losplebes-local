// Contenido del archivo script.js
const cardsContainer = document.getElementById("cards-container");
const categoriesContainer = document.getElementById(
  "cards-categories-container"
);

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

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
      console.log(data); //datos de cateoria consumidos de la api del web service
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

// Función para generar la plantilla de la tarjeta
function cardTemplate(product, fileName) {
  // Comprobar si el nombre de archivo es válido
  const imageUrl = `https://www.ta2.mx/imgPlebes/${fileName}`;
  const imageTag = new Image();
  imageTag.onerror = function () {
    // Si la imagen no se carga correctamente, mostrar imagen predeterminada
    //this.src = "../../assets/img/error_picture.jpg";
  };

  imageTag.src = imageUrl;

  return `
  <div class="card-producto card">
  <img src="${imageUrl}" class="card-img-top" style="height:300px" alt="Producto Imagen">
  <div class="card-product-content card-body">
    <p class="nombre-producto">${product.productoNombre}</p>
    <p class="precio-producto card-text">$${product.productoPrecio}</p>
  </div>
</div>

  `;
}

// Función para crear un botón de categoría
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

// Realizar la solicitud para obtener las categorías
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
    console.log(data); //datos de cateoria consumidos de la api del web service
    // Iterar sobre los datos de categoría y crear botones
    data.forEach((category) => {
      const categoryButton = createCategoryButton(category);
      categoriesContainer.appendChild(categoryButton);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las categorías:", error);
  });

// Cargar productos al inicio
cargarProductosDeCategoria(/* ID de la categoría inicial */);
