// Select the necessary elements
const allProducts = document.querySelector(".products-row");
const sortSelect = document.getElementById("sortSelect");
const pageButtonsContainer = document.querySelector(".page-btn");

let currentPage = 1;
let productsPerPage = 8;
let selectedSort = "latest";
let productsData = [];

async function fetchProducts() {
  try {
    const response = await fetch("./JSON'S/products.json");
    const data = await response.json();
    productsData = data.products;
    sortSelect.addEventListener("change", () => {
      selectedSort = sortSelect.value;
      renderProducts();
    });
    renderProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function sortProducts(products) {
  switch (selectedSort) {
    case "latest":
      return products.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "price":
      return products.sort((a, b) => a.price - b.price);
    case "rating":
      return products.sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}


function renderProducts() {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const sortedProducts = sortProducts(
    productsData.filter((product) => product.in_stock)
  );
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  
  allProducts.innerHTML = "";
  let row = document.createElement("div");
  row.classList.add("row");
  let productsPerRow = 0;

  paginatedProducts.forEach((product) => {
    const col = document.createElement("div");
    col.classList.add("col-4");
    col.innerHTML = `
    <a href="products-details.html?productId=${product.id}"><img src="${
      product.image_url
    }"></a>
    <a href="products-details.html?productId=${product.id}"><h4>${
      product.name
    }</h4></a>
        <div class="rating">
            ${getRatingStars(product.rating)}
        </div>
        <p>$${product.price}</p>
        <a href="#" class="btn addToCartBtn" data-product-id="${
          product.id
        }">Add To Cart</a>
      `;

    row.appendChild(col);
    productsPerRow++;

    if (productsPerRow === 4) {
      allProducts.appendChild(row);
      row = document.createElement("div");
      row.classList.add("row");
      productsPerRow = 0;
    }
  });

  if (productsPerRow > 0) {
    allProducts.appendChild(row);
  }

  renderPagination();
  setupAddToCartButtons();
}
function getRatingStars(rating) {
  const filledStars = '<i class="fa fa-star"></i>'.repeat(rating);
  const emptyStars = '<i class="fa fa-star-o"></i>'.repeat(5 - rating);
  return filledStars + emptyStars;
}
function renderPagination() {
  const totalPages = Math.ceil(productsData.length / productsPerPage);
  console.log(totalPages)
  pageButtonsContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("span");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButtonsContainer.appendChild(pageButton);
  }
}

function addToCart(productData) {
  const isLoggedIn = checkIfLoggedIn(); // Check if the user is logged in

  if (isLoggedIn) {
    const userEmail = sessionStorage.getItem("email");
    let cartProducts = localStorage.getItem(userEmail);

    if (!cartProducts) {
      cartProducts = [];
    } else {
      cartProducts = JSON.parse(cartProducts);
    }

    // Check if the product is already in the cart
    const isProductInCart = cartProducts.some(
      (item) => item.id === productData.id
    );

    if (!isProductInCart) {
      cartProducts.push(productData);
      localStorage.setItem(userEmail, JSON.stringify(cartProducts));

      // Update the cart count on the page
      const cartCountElement = document.getElementById("cartCount");
      cartCountElement.textContent = cartProducts.length;
    } else {
      alert("Product is already in the cart.");
    }
  } else {
    Swal.fire({
      title: "Please sign in first!",
      text: "Do you want to sign in",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "./logIn.html";
      } else {
      }
    });
  }
}

function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".addToCartBtn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = button.dataset.productId;
      const selectedProduct = productsData.find(
        (product) => product.id === productId
      );
      if (selectedProduct) {
        addToCart(selectedProduct);
      }
    });
  });
}


function afterSuccessfulSignIn() {
  const isLoggedIn = checkIfLoggedIn();
  const accountLink = document.getElementById("accountLink");

  if (isLoggedIn) {
    const userName = sessionStorage.getItem("username"); // Get the user's name from sessionStorage
    accountLink.href = "./dashboard.html";
    accountLink.textContent = `${userName}`; // Update the link text to display the user's name
  } else {
    accountLink.href = "./logIn.html";
    accountLink.textContent = "Account";
  }
}

function checkIfLoggedIn() {
  const email = sessionStorage.getItem("email");
  return !!email;
}
// Check if the user is logged in and call afterSuccessfulSignIn if true
if (checkIfLoggedIn()) {
  afterSuccessfulSignIn();
}
fetchProducts();
