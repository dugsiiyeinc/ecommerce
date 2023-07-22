// selecting elements from dom
const form = document.getElementById("signinForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordSignInToggle = document.getElementById("passwordSignIn-Toggle");

// passwordSignInToggle
passwordSignInToggle.onclick = function () {
  if (password.type == "password") {
    password.type = "text";
    passwordSignInToggle.src = "images/open.png";
  } else {
    password.type = "password";
    passwordSignInToggle.src = "images/close.png";
  }
};

// showError function
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "control-form error";
  const small = formControl.querySelector("small");
  small.style.visibility = "visible";
  small.innerText = message;
}

// showSuccess function
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "control-form success";
  const small = formControl.querySelector("small");
  small.style.visibility = "hidden";
}

// checkRequired
function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// getFieldName function
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// get customers from local storage
function getCustomersFromLocalStorage() {
  const customersData = localStorage.getItem("inputs");
  return customersData ? JSON.parse(customersData) : [];
}

// add event listener
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  checkRequired([email, password]);

  // Fetch customers from local storage and JSON file
  const customersFromLocalStorage = getCustomersFromLocalStorage();
  const customersFromJSON = await getCustomersFromJSON();

  // Combine the customers from both sources
  const allCustomers = [...customersFromLocalStorage, ...customersFromJSON];

  // Get enteredEmail and enteredPassword
  const enteredEmail = email.value.trim();
  const enteredPassword = password.value.trim();

  // Find the customer with entered email
  const matchedCustomer = allCustomers.find(
    (customer) => customer.email === enteredEmail
  );

  // Check if the customer exists and entered password matches
  if (matchedCustomer && matchedCustomer.password === enteredPassword) {
    // Authentication successful
    // You can store the user session/token in local storage or redirect to the authenticated area of your website
    sessionStorage.setItem("email", enteredEmail);
    const emailParts = enteredEmail.split("@"); // Split the email into an array at the '@' symbol
    const username = emailParts[0]; // The username will be the first element of the array

    // Store the username in sessionStorage
    sessionStorage.setItem("username", username);
    // Redirect to authenticated area
    window.location.href = "index.html";
  } else {
    // Authentication failed
    // Display an error message
    showError(email, "Invalid email or password");
  }
});

async function getCustomersFromJSON() {
  try {
    const response = await fetch(`./JSON'S/customers.json`);
    if (!response.ok) {
      throw new Error("Unable to fetch data from the JSON file.");
    }
    const jsonData = await response.json();
    return jsonData.customers;
  } catch (error) {
    console.error(error);
    return [];
  }
}
