window.addEventListener("load", function () {
  // Inicializar funciones por separado
  initCarousel();
  displayCategories();
  displayProducts();
  displayProductDetails();
});

// Función para inicializar el carrusel
async function initCarousel() {
  const carouselElement = document.querySelector("#carouselE1");
  if (!carouselElement) return;

  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=3");
    if (!response.ok) throw new Error("Network response was not ok");
    const products = await response.json();

    const carouselInner = carouselElement.querySelector(".carousel-inner");
    const indicators = carouselElement.querySelector(".carousel-indicators");

    if (carouselInner && indicators) {
      carouselInner.innerHTML = products
        .map(
          (product, index) => `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="${
                      product.image
                    }" class="d-block w-100 d-img" alt="${
            product.title
          }" loading="lazy">
                    <div class="carousel-caption">
                        <h5>${product.title}</h5>
                        <p>${product.description}</p>
                        <p><a href="./productos.html" class="btn btn-custom mt-3">Ver Productos</a></p>
                    </div>
                </div>
            `
        )
        .join("");

      indicators.innerHTML = products
        .map(
          (_, index) => `
                <button type="button" data-bs-target="#carouselE1" data-bs-slide-to="${index}"
                    class="${index === 0 ? "active" : ""}"
                    aria-current="${index === 0 ? "true" : "false"}"
                    aria-label="slide ${index + 1}">
                </button>
            `
        )
        .join("");
    }
  } catch (error) {
    console.log("Error initializing carousel", error);
  }
}

// Función para mostrar las categorías
async function displayCategories() {
  const categoriesSection = document.querySelector("#categoriesSection");
  if (!categoriesSection) return;

  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const categories = await response.json();

    categoriesSection.innerHTML = categories
      .map((category) => {
        const categoryMap = {
          electronics: "electronics",
          jewelery: "jewelery",
          "men's clothing": "men-clothing",
          "women's clothing": "women-clothing",
        };
        const categoryId = categoryMap[category] || "";

        return `
                <div class="col-md-3 mb-4">
                    <div class="category d-flex justify-content-center rounded-pill">
                        <a class="btn text-capitalize rounded-pill" href="./productos.html#${categoryId}" role="button">${category}</a>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
}

// Función para generar estrellas según la calificación
function generateStars(rating) {
  const fullStar = '<i class="bi bi-star-fill"></i>';
  const halfStar = '<i class="bi bi-star-half"></i>';
  const emptyStar = '<i class="bi bi-star"></i>';

  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    fullStar.repeat(fullStars) +
    halfStar.repeat(halfStars) +
    emptyStar.repeat(emptyStars)
  );
}

// Función para mostrar productos por categoría
async function displayProducts() {
  const categories = [
    { apiName: "electronics", elementId: "electronics" },
    { apiName: "jewelery", elementId: "jewelery" },
    { apiName: "men's clothing", elementId: "men-clothing" },
    { apiName: "women's clothing", elementId: "women-clothing" },
  ];

  const fetchCategoryPromises = categories.map(async (category) => {
    const container = document.getElementById(category.elementId);
    if (!container) return;

    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category.apiName}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const products = await response.json();

      container.innerHTML = products
        .map(
          (product) => `
                <div class="product-card col-md-3">
                    <img src="${product.image}" alt="${
            product.title
          }" class="product-image" loading="lazy"/>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating p-3">Rating: ${generateStars(
                      product.rating.rate
                    )}</div>
                    <a class="btn btn-custom" href="producto.html?id=${
                      product.id
                    }">Ver Producto</a>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.log(
        `Error fetching products for category ${category.apiName}:`,
        error
      );
    }
  });

  await Promise.all(fetchCategoryPromises); // Esperar a que todas las categorías se carguen
}

// Función para mostrar detalles de un producto individual
async function displayProductDetails() {
  const productImage = document.getElementById("product-image");
  const productTitle = document.getElementById("product-title");
  const productDescription = document.getElementById("product-description");
  const productPrice = document.getElementById("product-price");
  const buyButton = document.getElementById("buy-button");

  if (
    !productImage ||
    !productTitle ||
    !productDescription ||
    !productPrice ||
    !buyButton
  )
    return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    console.error("No se proporcionó el ID del producto en la URL.");
    return;
  }

  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const product = await response.json();

    productImage.src = product.image;
    productTitle.textContent = product.title;
    productDescription.textContent = product.description;
    productPrice.textContent = `$${product.price.toFixed(2)}`;

    buyButton.addEventListener("click", () => {
      const quantitySelect = document.getElementById("quantity-select");
      const quantity = quantitySelect ? quantitySelect.value : 1;
      console.log(
        `Producto: ${product.title}, cantidad seleccionada: ${quantity}`
      );
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Manejar el desplazamiento suave después de que todo haya cargado
window.addEventListener("load", function () {
  setTimeout(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, 700); // Retrasar el desplazamiento para asegurar que todo el contenido esté cargado
});
