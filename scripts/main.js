// select elements
const featured = document.querySelector(".featured-products");
const latest = document.querySelector(".Latest-products");
const allProducts = document.querySelector(".products-row");

async function fetchProducts() {
  const response = await fetch(`JSON'S/products.json`);
  const data = await response.json();
  const products = data.products;

  products.forEach((product) => {
    if (product.featured && product.in_stock) {
      featured.innerHTML += `
        <div class="col-4">
        <a href="products-details.html?productId=${product.id}"><img src="${product.image_url}"></a>
        <a href="products-details.html?productId=${product.id}">
            <h4>${product.name}</h4>
          </a>
          <div class="rating">
          ${getRatingStars(product.rating)}
      </div>
          <p>$${product.price}</p>
          <a href="#" class="btn addToCartBtn" data-product-id="${product.id}">Add To Cart</a>
        </div>
      `;
    }
  });

  const lastEightProducts = products.slice(-8);
  lastEightProducts.forEach((product) => {
    if (product.in_stock) {
      latest.innerHTML += `
      <div class="col-4" data-product -id="${product.id}">
      <a href="products-details.html?productId=${product.id}"><img src="${
        product.image_url
      }"></a>
      <a href="products-details.html?productId=${product.id}">
            <h4>${product.name}</h4>
          </a>
          <div class="rating">
            ${getRatingStars(product.rating)}
        </div>
          <p>$${product.price}</p>
          <a href="#" class="btn addToCartBtn" data-product-id="${
            product.id
          }">Add To Cart</a>
        </div>
      `;
    }
  });

  setupAddToCartButtons(products); // Pass 'products' array to the function
}

function getRatingStars(rating) {
  const filledStars = '<i class="fa fa-star"></i>'.repeat(rating);
  const emptyStars = '<i class="fa fa-star-o"></i>'.repeat(5 - rating);
  return filledStars + emptyStars;
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
      }
    });
  }
}

function setupAddToCartButtons(products) {
  // Accept 'products' as an argument
  const addToCartButtons = document.querySelectorAll(".addToCartBtn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = button.dataset.productId;
      const selectedProduct = products.find(
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