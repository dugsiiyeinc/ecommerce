function displayCartItems() {
  const cartPage = document.querySelector(".cart-page");
  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);

  if (cartItems) {
    const products = JSON.parse(cartItems);
    let total = 0;
    let itemCount = 0;

    let cartTable = `
      <table>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
    `;

    products.forEach((product, index) => {
      // Initialize quantity if not present (default to 1)
      if (!product.quantity) {
        product.quantity = 1;
      }

      // Calculate the subtotal for the product
      const subtotal = product.price * product.quantity;
      total += subtotal;
      itemCount += product.quantity;

      cartTable += `
        <tr>
          <td>
            <div class="cart-info">
              <img src="${product.image_url}">
              <div>
                <p>${product.name}</p>
                <small>Price: $${product.price}</small>
                <br>
                <a href="#" class="remove-link" data-product-index="${index}">Remove</a>
              </div>
            </div>
          </td>
          <td>
            <input type="number" value="${product.quantity}" min="1" max="${
        product.items_left
      }"
              data-product-id="${product.id}" data-product-price="${
        product.price
      }">
          </td>
          <td class="subtotal">$${(product.price * product.quantity).toFixed(
            2
          )}</td>
        </tr>
      `;
    });

    cartTable += `
      </table>
      <div class="total-price">
        <table>
          <tr>
            <td>Total</td>
            <td>$${total.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      <div class ="btns">
      <a href="#" class="btn checkout" id="checkoutBtn">Checkout</a>
      <a href="#" class="btn whatsApp" style="font-size:16px;" id="whatsApp">Buy Via WhatsApp</a>
      </div>
    `;

    cartPage.innerHTML = cartTable;
    const cartCountElement = document.getElementById("cartCount");
    cartCountElement.textContent = itemCount.toString();
    // Add event listeners to quantity inputs
    const quantityInputs = cartPage.querySelectorAll("input[type='number']");
    quantityInputs.forEach((input) => {
      input.addEventListener("change", (event) => {
        updateCart(event); // Update the cart for the specific product
        displayCartItems(); // Refresh the cart display after changing the quantity
      });
    });
    // Add event listener to the checkout button
    const checkoutBtn = cartPage.querySelector("#checkoutBtn");
    checkoutBtn.addEventListener("click", () => {
      checkout(); // Call the checkout function when the button is clicked
    });
    // Add event listeners to remove links
    const removeLinks = cartPage.querySelectorAll(".remove-link");
    removeLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const index = parseInt(link.dataset.productIndex);
        removeCartItem(index);
        displayCartItems(); // Refresh the cart display after removing
      });
    });
  } else {
    // Cart is empty
    cartPage.innerHTML = `
      <div class="cart-empty">
        <img src="./images/empty-cart.png" alt="empty-cart">
        <p class="empty">Your cart is empty.</p>
      </div>
    `;
    const cartCountElement = document.getElementById("cartCount");
    cartCountElement.textContent = "0";
  }
}

function getInputsFromStorage() {
  const inputsData = localStorage.getItem("inputs");
  return inputsData ? JSON.parse(inputsData) : [];
}

function checkout() {
  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);
  if (cartItems) {
    const products = JSON.parse(cartItems);
    const inputsFromStorage = getInputsFromStorage();
    const userIndex = inputsFromStorage.findIndex(
      (input) => input.email === userEmail
    );

    if (userIndex !== -1) {
      // Add the cart items to the user's orders
      const user = inputsFromStorage[userIndex];
      if (!user.orders) {
        user.orders = []; // Initialize the orders array if it doesn't exist
      }

      // Create a new array to store cart items with quantity details
      const cartItemsWithQuantity = products.map((product) => ({
        ...product,
        quantity: product.quantity || 1,
      }));

      // Add the cart items to the user's orders
      user.orders.push(...cartItemsWithQuantity);

      // Calculate the total price for the current order
      let total = 0;
      products.forEach((product) => {
        total += product.price * (product.quantity || 1);
      });
      // Save the updated user data back to local storage
      localStorage.setItem("inputs", JSON.stringify(inputsFromStorage));
      // Clear the cart items after checkout
      localStorage.removeItem(userEmail);
      // Display a message or redirect to a success page if desired
      Swal.fire({
        title: "Checkout Success",
        text: "Your order has been placed successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
         window.location.href = "dashboard.html";
        }
      });;
      displayCartItems();
    }
  }
}
function updateCartCount() {
  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);
  const cartCountElement = document.getElementById("cartCount");

  if (cartItems) {
    const products = JSON.parse(cartItems);
    let total = 0;
    products.forEach((product) => {
      total += product.quantity || 0;
    });
    cartCountElement.textContent = total.toString();
  } else {
    cartCountElement.textContent = "0";
  }
}

function updateCart(event) {
  const input = event.target;
  const productId = input.dataset.productId;
  const productPrice = parseFloat(input.dataset.productPrice);
  const quantity = parseInt(input.value);

  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);
  if (cartItems) {
    const products = JSON.parse(cartItems);
    const productToUpdate = products.find(
      (product) => product.id === productId
    );
    if (productToUpdate) {
      const previousQuantity = productToUpdate.quantity || 1;
      const quantityDifference = quantity - previousQuantity;
      const totalPriceDifference = productPrice * quantityDifference;

      // Update the quantity and subtotal
      productToUpdate.quantity = quantity;
      const subtotalCell = input.parentElement.nextElementSibling;
      const newSubtotal = productPrice * quantity;
      subtotalCell.textContent = `$${newSubtotal.toFixed(2)}`;

      // Update the total price
      let total = 0;
      products.forEach((product) => {
        total += product.price * product.quantity;
      });
      const totalCell = document.querySelector(".total-price td:last-child");
      totalCell.textContent = `$${total.toFixed(2)}`;

      // Update the "items_left"
      const itemsLeft = productToUpdate.items_left || 0;
      const newItemsLeft = itemsLeft - quantityDifference;
      productToUpdate.items_left = newItemsLeft;

      // Save the updated products back to local storage
      localStorage.setItem(userEmail, JSON.stringify(products));
    }
  }
}

function removeCartItem(index) {
  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);
  if (cartItems) {
    const products = JSON.parse(cartItems);
    if (index >= 0 && index < products.length) {
      const removedProduct = products.splice(index, 1)[0];
      const quantityDifference = -removedProduct.quantity;
      const totalPriceDifference =
        -removedProduct.price * removedProduct.quantity;

      // Update the total price
      let total = 0;
      products.forEach((product) => {
        total = product.price * product.quantity;
      });
      const totalCell = document.querySelector(".total-price td:last-child");
      totalCell.textContent = `$${total.toFixed(2)}`;

      // Save the updated products back to local storage
      localStorage.setItem(userEmail, JSON.stringify(products));

      if (products.length === 0) {
        // Clear the cart page when the last item is removed
        const cartPage = document.querySelector(".cart-page");
        cartPage.innerHTML = "<p>Your cart is empty.</p>";
        // Clear the local storage when cart is empty
        localStorage.removeItem(userEmail);
      }
    }
  }
}

function redirectToWhatsApp() {
  const phoneNumber = "254799982410";

  // Get cart items from local storage
  const userEmail = sessionStorage.getItem("email");
  const cartItems = localStorage.getItem(userEmail);
  const products = cartItems ? JSON.parse(cartItems) : [];

  // Create the WhatsApp message with cart item details
  let message = "I want to order the following items:\n";
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.name} \n`;
    message += `    Details: https://ecommerce-beige-five.vercel.app/products-details.html?productId=${product.id}\n`;
  });

  // Create the WhatsApp message URL
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Redirect to the WhatsApp URL
  window.location.href = whatsappURL;
}

function setupWhatsAppButton() {
  const whatsappButton = document.getElementById("whatsApp");
  whatsappButton.addEventListener("click", () => {
    redirectToWhatsApp(); // Redirect to WhatsApp with the cart items message
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
displayCartItems();
setupWhatsAppButton();
