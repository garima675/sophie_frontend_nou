
  
// Function to handle form submission after the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the form element from the DOM
    const formElement = document.getElementById("form");

    // Event listener to handle form submission
    formElement.addEventListener("submit", async function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Retrieve user input from the form
        const userData = {
            email: formElement.email.value,
            password: formElement.password.value,
        };

        try {
            // Attempt to log in the user using the provided credentials
            const loginResult = await performLogin(userData);

            // If login is successful, store the token in session storage
            sessionStorage.setItem("token", loginResult.token);

            // Redirect the user to the index page
            window.location.href = "index.html";
        } catch (loginError) {
            // If there's an error during login, reset the form and display an error message
            formElement.email.value = "";
            formElement.password.value = "";
            showErrorMessage("Invalid email or password. Please try again.");
        }
    });

    // Set the height of the body element to 100%
    document.body.style.height = "100%";
});

// Function to perform user login by making an API call
async function performLogin(userCredentials) {
    // Define the URL for the login API endpoint
    const loginUrl = "http://localhost:5678/api/users/login";

    try {
        // Make a POST request to the login API endpoint with user credentials
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(userCredentials),
        });

        // Check if the API call was successful
        if (!response.ok) {
            // If not, throw an error with the response status text
            throw new Error(`Login failed: ${response.statusText}`);
        }

        // Parse and return the JSON response
        return response.json();
    } catch (error) {
        // If an error occurs during the API call, throw it further
        throw error;
    }
}
// Function to show the error message modal
function showErrorMessage() {
  // Retrieve the modal dialog element
  const errorMessageModal = document.querySelector(".modal__login-alert");

  // Show the modal dialog
  errorMessageModal.showModal();
}

// Function to close the error message modal
function closeErrorMessage() {
  // Retrieve the modal dialog element
  const errorMessageModal = document.querySelector(".modal__login-alert");

  // Close the modal dialog
  errorMessageModal.close();
}

// Event listener for the "Réessayer" button in the error message modal
document.querySelector(".btn__tryId").addEventListener("click", function() {
  // Close the error message modal when the button is clicked
  closeErrorMessage();
});





  





