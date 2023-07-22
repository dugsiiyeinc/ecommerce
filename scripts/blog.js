const post = document.querySelector(".blogs");

async function fetchBlogs() {
  try {
    const response = await fetch(`./JSON'S/blogs.json`);
    const data = await response.json();
    const blogs = data;

    blogs.forEach((blog) => {
      const blogContent = blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content;
      post.innerHTML += `
        <div class="col-md-4">
          <div class="card" style="width: 18rem;">
            <img src="${blog.coverPhoto}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${blog.title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${blog.date}</h6>
              <p class="card-text">${blogContent}</p>
              <a href="#" class="read-more-link" data-blog-content="${blog.content}">Read More</a>
            </div>
          </div>
        </div>
      `;
    });

    // Add event listener for "Read More" links
    const readMoreLinks = document.querySelectorAll(".read-more-link");
    readMoreLinks.forEach((link) => {
      link.addEventListener("click", handleReadMoreClick);
    });
  } catch (error) {
    console.log("something is wrong" + error);
  }
}

function handleReadMoreClick(event) {
    event.preventDefault();
    const content = event.target.dataset.blogContent;
    const cardBody = event.target.parentElement;
    const cardText = cardBody.querySelector(".card-text");
  
    if (cardText.textContent === content) {
      const truncatedContent = content.length > 100 ? content.substring(0, 100) + "..." : content;
      cardText.textContent = truncatedContent;
      event.target.textContent = "Read More";
    } else {
      cardText.textContent = content;
      event.target.textContent = "Less";
    }
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
fetchBlogs();
