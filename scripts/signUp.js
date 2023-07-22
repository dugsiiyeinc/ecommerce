// selecting elements from dom
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const passwordToggle = document.getElementById('password-toggle');
const confirmPasswordToggle = document.getElementById('confirmPassword-toggle');
const createBtn = document.getElementById('createBtn');

// password toggle event
passwordToggle.onclick = function() {
  if(password.type == "password") {
    password.type = 'text';
    passwordToggle.src = 'images/open.png'
  }  else {
    password.type = 'password';
    passwordToggle.src = 'images/close.png';
  }
}
// confirm password toggle event
confirmPasswordToggle.onclick = function() {
  if(confirmPassword.type == "password") {
    confirmPassword.type = 'text';
    confirmPasswordToggle.src = 'images/open.png';
  } else {
    confirmPassword.type = 'password';
    confirmPasswordToggle.src = 'images/close.png';
  }
}

// showError function
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'control-form error';
  const small = formControl.querySelector('small');
  small.style.visibility = 'visible';
  small.innerText = message;
}

// showSuccess
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'control-form success';
  const small = formControl.querySelector('small');
  small.style.visibility = 'hidden';
}


// checkRequired function
function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    if(input.value.trim() === '') {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  })
}

// checkLength function
function checkLength(input, min, max) {
  if(input.value.trim() !=='') {
    if(input.value.length < min) {
      showError(input, `${getFieldName(input)} must be at least ${min} characters`)
    } else if(input.value.length > max) {
      if(input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at most ${max} characters`)
    } else {
      showSuccess(input);
    }

  } 
}
}
// checkEmail function
function checkEmail(input) {
  if(input.value.trim() !== '') {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailRegex.test(input.value.trim())) {
      showSuccess(input)
    } else {
      showError(input, 'Invalid Email')
    }
  }

}
// function confirmPasswordMatching
function confirmPasswordMatching(p1, p2) {
  if(p2.value.trim() !== '') {
    if(p1.value === p2.value) {
      showSuccess(p2);
    } else {
      showError(p2, `Password do not Matching`);
   }
  }
}
// getFieldName function
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// getInputFromStorage function
function getInputsFromStorage() {
  let inputsData = localStorage.getItem('inputs');
  return inputsData ? JSON.parse(inputsData) : [];
}

// Function to check if an email already exists in local storage
function isEmailAlreadyExists(email) {
  const inputsFromStorage = getInputsFromStorage();
  return inputsFromStorage.some((input) => input.email === email);
}

// add Account To Storage function
function addAccountToStorage() {
  checkRequired([name, email, password, confirmPassword]);
  checkLength(name, 3, 15);
  checkLength(password, 8, 20);
  checkEmail(email);
  confirmPasswordMatching(password, confirmPassword);

  // check if there are error messages displayed
  const errorMessages = document.querySelectorAll('.error');
  if (errorMessages.length === 0) {
    // Check if the email already exists in local storage
    if (isEmailAlreadyExists(email.value.trim())) {
      // Show alert for the email being already registered
      alert('This email is already registered.');
    } else {
      const inputs = {
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        orders: [],
        id: generateRandomID(1, 1000)
      };
      // add the inputs object to local storage
      let inputsFromStorage = getInputsFromStorage();
      inputsFromStorage.push(inputs);
      localStorage.setItem('inputs', JSON.stringify(inputsFromStorage));
      window.location.href = "logIn.html";
    }
  }
}
function generateRandomID(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// clearInput when their are no error messages
function clearInputs() {
  const errorMessages = document.querySelectorAll('.error');
  if(errorMessages.length === 0) {
    name.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
  }
}
// add event listener to the form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  checkRequired([name, email, password, confirmPassword]);
  checkLength(name, 3, 15);
  checkLength(password, 8, 20);
  checkEmail(email);
  confirmPasswordMatching(password, confirmPassword);
  clearInputs();
});

createBtn.addEventListener('click', addAccountToStorage);