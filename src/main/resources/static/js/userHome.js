document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("loggedInUser"); // Replace with dynamic username
    fetch(`http://localhost:8080/api/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("User not found");
            }
            return response.json();
        })
        .then(user => {
            document.getElementById("title_card").textContent = "Welcome Back, " + (user.firstName || "") + " " + (user.lastName || "");
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data.");
        });
});

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "signup.html";
  });
