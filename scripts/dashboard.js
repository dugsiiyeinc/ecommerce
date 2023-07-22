function getOrdersFromLocalStorage() {
    const userEmail = sessionStorage.getItem("email");
    const cartItems = localStorage.getItem("inputs");
    return cartItems ? JSON.parse(cartItems) : [];
  }

  // Function to get orders from JSON file
  async function getOrdersFromJson() {
    try {
      const response = await fetch(`JSON'S/customers.json`); // Replace 'path/to/orders.json' with the correct path to your JSON file
      const data = await response.json();
      return data.orders || []; // Assuming the JSON structure has an 'orders' array
    } catch (error) {
      console.error("Error fetching orders from JSON:", error);
      return [];
    }
  }

  // Function to get customer data from local storage
  function getCustomersFromLocalStorage() {
    const customersData = localStorage.getItem('inputs');
    return customersData ? JSON.parse(customersData) : [];
  }

  // Function to display orders for a specific customer
  
// Function to display orders for a specific customer
async function displayCustomerOrders(customerEmail) {
    const customers = getCustomersFromLocalStorage();
    const customer = customers.find((customer) => customer.email === customerEmail);
    console.log(customer)
  
    if (customer) {
      const ordersTableBody = document.querySelector("tbody");
      ordersTableBody.innerHTML = ""; // Clear existing table rows
  
      customer.orders.forEach((order) => {
        const orderRow = `
          <tr>
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.quantity}</td>
            <td>$${(order.price * order.quantity).toFixed(2)}</td>
          </tr>
        `;
        ordersTableBody.innerHTML += orderRow;
      });
    } else {
      console.log("Customer not found.");
    }
  }

  function signOut() {
    sessionStorage.clear(); // Clear the session storage to log out the user
    window.location.href = "index.html"; // Redirect the user to the login page after signing out
  }

  // Add an event listener to the sign-out button
  const signOutButton = document.getElementById("signOutBtn");
  if (signOutButton) {
    signOutButton.addEventListener("click", signOut);
  }
  // Function to display orders for the currently logged-in customer
  function displayCurrentCustomerOrders() {
    const userEmail = sessionStorage.getItem("email");
    if (userEmail) {
      displayCustomerOrders(userEmail);
    } else {
       window.location.href = "login.html";
    }
  }
  displayCurrentCustomerOrders();
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