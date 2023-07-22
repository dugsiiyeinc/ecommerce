const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("productId");
const addToCartBtn = document.querySelector('.addToCartBtn');
const cartCountElement = document.getElementById('cartCount');

async function fetchProductDetails() {
  try {
    const response = await fetch("./JSON'S/products.json");
    const data = await response.json();
    const product = data.products.find((item) => item.id === productId);
    if (product) {
      updateProductDetails(product);
      setupAddToCartButton(product); // Pass the product to setupAddToCartButton
    } else {
      document.querySelector("body").innerHTML = `
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="error-template">
                <h1>Oops!</h1>
                <h2>404 Not Found</h2>
                <div class="error-details">
                  Sorry, an error has occurred, Requested page not found!
                </div>
                <div class="error-actions">
                  <a href="./index.html" class="btn btn-primary btn-lg">
                    <span class="glyphicon glyphicon-home"></span> Take Me Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function updateProductDetails(product) {
  document.getElementById("ProductImg").src = product.image_url;
  document.getElementById("product-category").textContent =
    "Home / " + product.category;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-price").textContent = "$" + product.price;
  document.getElementById("product-description").textContent =
    product.description;
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

function setupAddToCartButton(product) {
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product);

    // Update the cart count on the page
    const userEmail = sessionStorage.getItem("email");
    const cartItems = localStorage.getItem(userEmail);
    const cartProducts = cartItems ? JSON.parse(cartItems) : [];
    cartCountElement.textContent = cartProducts.length;
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

fetchProductDetails();

const review = document.querySelector(".addReview");
async function fetchProductReview() {
  try {
    const response = await fetch(`./JSON'S/reviews.json`);
    const data = await response.json();
    console.log(data);
    const reviews = data.reviews.filter((item) => item.productId === productId);
    if (reviews.length > 0) {
      review.innerHTML = `
        <div class="containers">
          <h1>Customers Review</h1>
          <div class="box">
            ${reviews
              .map(
                (review) => {
                  const reviewTimestamp = new Date(review.timestamp).toLocaleDateString();
                  return `
                    <div class="card">
                      <div class="head">
                        <div class="flex-cl">
                          <div class="name">
                            <span id="name">${review.customerName}</span><br>
                            <span id="time">${reviewTimestamp}</span>
                            <div class="rating">
                              ${getRatingStars(review.rating)}
                            </div>
                          </div>
                          <p id="comment">${review.comments}</p>
                        </div>
                      </div>
                    </div>
                  `;
                }
              )
              .join("")}
          </div>
        </div>`;
    } else {
      review.innerHTML = '';
    }
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }
}
function getRatingStars(rating) {
  const filledStars = '<i class="fa fa-star"></i>'.repeat(rating);
  const emptyStars = '<i class="fa fa-star-o"></i>'.repeat(5 - rating);
  return filledStars + emptyStars;
}

fetchProductReview();