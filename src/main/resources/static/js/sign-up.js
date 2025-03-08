document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");

    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginError = document.getElementById("loginError");
    const signupError = document.getElementById("signupError");

    signupForm.querySelectorAll('input').forEach(input => input.value = '');
    loginForm.querySelectorAll('input').forEach(input => input.value = '');
    // show Toast Notifications
    function showToast(message, type) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        // Add icon to the toast (success or error)
        const icon = document.createElement('span');
        icon.classList.add('toast-icon');
        if (type === 'success') {
            icon.innerHTML = '&#10003;'; // Checkmark for success
        } else if (type === 'error') {
            icon.innerHTML = '&#10060;'; // Cross for error
        }

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('toast-message');
        messageContainer.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.classList.add('toast-close');
        closeButton.innerHTML = '&times;'; // X for closing the toast
        closeButton.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        });

        toast.appendChild(icon);
        toast.appendChild(messageContainer);
        toast.appendChild(closeButton);
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Remove the toast after 4 seconds if not manually closed
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }


    // Toggle to Login Form
    btnLogin.addEventListener("click", () => {
        signupForm.querySelectorAll('input').forEach(input => input.value = '');
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        btnLogin.disabled = true;
        btnSignup.disabled = false;
        signupError.textContent = "";

        // Transition for login form
        loginForm.style.opacity = 0;
        setTimeout(() => {
            loginForm.style.opacity = 1;
        }, 200);
    });

    // Toggle to Signup Form
    btnSignup.addEventListener("click", () => {
        loginForm.querySelectorAll('input').forEach(input => input.value = '');
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        btnSignup.disabled = true;
        btnLogin.disabled = false;
        loginError.textContent = "";

        // Transition for signup form
        signupForm.style.opacity = 0;
        setTimeout(() => {
            signupForm.style.opacity = 1;
        }, 200);
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
                const user = await response.json(); 
                localStorage.setItem("loggedInUser", user.username); 
                localStorage.setItem("userType", user.userType);
                localStorage.setItem("userId", user.userId);
                showToast("Login successful! Welcome back.", 'success');
                if(user.userType === "Admin")
                    window.location.href = "AdminPanel.html"; 
                else
                    window.location.href = "userhome.html";
            } else {
                const errorData = await response.json();
                console.log(errorData);
                showToast("Log-In failed. " + errorData.error + "Please try again.", 'error');
            }
        } catch (error) {
            console.log(error);
            showToast("Server error. Please try again later.", 'error');
        }
    });

    // Handle Signup Form Submission
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("fname").value;
        const lastName = document.getElementById("lname").value;
        const username = document.getElementById("username").value;
        const dateOfBirth = document.getElementById("dob").value;
        const gender = document.getElementById("gender").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showToast("Passwords do not match!", 'error');
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, username, dateOfBirth, gender, email, password }),
            });

            if (response.ok) {
                showToast("Signup successful! Please log in.", 'success');
                btnLogin.click(); 
            } else {
                const errorData = await response.json();
                showToast("Signup failed: " + errorData.error + "\nPlease try again.", 'error');
            }
        } catch (error) {
            showToast("Server error. Please try again later.", 'error');
        }
    });

    btnLogin.click();
});
