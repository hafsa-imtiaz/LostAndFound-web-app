document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const btnemail = document.getElementById("email-btn");

      // Form submission handlers
      document.getElementById("loginForm").addEventListener("submit", (e) => {
          e.preventDefault(); // Prevent default form submission
          window.location.href = "userhome.html"; // Redirect to dashboard
      });
  
      document.getElementById("signupForm").addEventListener("submit", (e) => {
          e.preventDefault(); // Prevent default form submission
          window.location.href = "userhome.html"; // Redirect to dashboard
      });

    

    // Initially, login is active => disable login button
    btnLogin.disabled = true;
    btnSignup.disabled = false;
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  
    // Toggle to Login
    btnLogin.addEventListener("click", () => {
      if (!btnLogin.disabled) {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        btnLogin.disabled = true;
        btnSignup.disabled = false;
      }
    });
  
    // Toggle to Sign Up
    btnSignup.addEventListener("click", () => {
      if (!btnSignup.disabled) {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        btnSignup.disabled = true;
        btnLogin.disabled = false;
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const messageUserBtn = document.getElementById("email-btn");

    if (messageUserBtn) {
        // Replace these with dynamic data from your backend :)
        const userEmail = "aounjee975@gmail.com"; // User's email
        const itemName = "Black Leather Wallet"; // Item name
        const userName = "Aoun Jee"; // User's name

        // Construct the Gmail URL
        const subject = `Regarding Your Lost Item: ${itemName}`;
        const body = `Hello ${userName},\n\nI found your lost item (${itemName}) and would like to return it to you.\n\nPlease let me know how we can proceed.\n\nBest regards,\n[Your Name]`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Set the button's click behavior
        messageUserBtn.addEventListener("click", () => {
            window.open(gmailUrl, "_blank"); // Open Gmail in a new tab
        });
    }
});

  document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded successfully");


    // 1. Sidebar Navigation Handling

    const sidebarItems = document.querySelectorAll(".nav-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.textContent.trim();
            switch (page) {
                case "Home":
                    window.location.href = "UserHome.html";
                    break;
                case "Report Items":
                    window.location.href = "Reports.html";
                    break;
                case "Search Items":
                    window.location.href = "search.html";
                    break;
                case "Profile Settings":
                    window.location.href = "Profile.html";
                    break;
                case "Help Center":
                    alert("Redirecting to Help Center (Not implemented yet)");
                    break;
                default:
                    console.warn("Navigation not found:", page);
            }
        });
    });

    const viewDetailsButton = document.getElementById("View Details");
    if (viewDetailsButton) {
        viewDetailsButton.addEventListener("click", () => {
            window.location.href = "itemDetails.html";
        });
    }



    // 2. Profile Picture Upload Feature

    const uploadInput = document.getElementById("upload-photo");
    const profileImage = document.getElementById("profile-img");

    if (uploadInput && profileImage) {
        uploadInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profileImage.src = e.target.result;
                    alert("Profile picture updated successfully!");
                };
                reader.readAsDataURL(file);
            }
        });
    }

});

  