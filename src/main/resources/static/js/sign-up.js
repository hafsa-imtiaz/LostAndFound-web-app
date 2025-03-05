document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    //const signupError = document.getElementById("signupError");
    const loginError = document.getElementById("loginError");

    // Initially show the login form
    btnLogin.disabled = true;
    btnSignup.disabled = false;
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");

    // Toggle to Login Form
    btnLogin.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        btnLogin.disabled = true;
        btnSignup.disabled = false;
        signupError.textContent = ""; // Clear any previous errors
    });

    // Toggle to Signup Form
    btnSignup.addEventListener("click", () => {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        btnSignup.disabled = true;
        btnLogin.disabled = false;
        loginError.textContent = ""; // Clear any previous errors
    });

    // Handle Login Form Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        loginError.textContent = "";

        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                console.log("yahan");
                const user = await response.json(); // Extract user data
                console.log("yahan");
                localStorage.setItem("loggedInUser", user.username); // Store logged-in user's username
                window.location.href = "userhome.html"; // Redirect to user dashboard
            } else {
                const errorData = await response.json();
                loginError.textContent = errorData.message || "Log-In failed. Invalid Email or Password. Please try again.";
            }
        } catch (error) {
            alert("Server error. Please try again later.");
        }
    });


    // Handle Signup Form Submission
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("fname").value;
        const lastName = document.getElementById("lname").value;
        const username = document.getElementById("username").value;
        const date_of_birth = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        //signupError.textContent = " "; // Clear previous errors

        // Basic validation
        if (password !== confirmPassword) {
            signupError.textContent = "Passwords do not match!";
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, username, date_of_birth, gender, email, password }),
            });

            if (response.ok) {
                alert("Signup successful! Please log in.");
                btnLogin.click(); // Switch to login form after successful signup
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            alert("Server error. Please try again later.");
        }
    });
});
