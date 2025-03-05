document.addEventListener("DOMContentLoaded", function () {
    const username =  localStorage.getItem("loggedInUser"); // Replace with dynamic username

    fetch(`http://localhost:8080/api/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("User not found");
            }
            return response.json();
        })
        .then(user => {
            document.getElementById("fullName").value = user.firstName + " " + user.lastName;
            document.getElementById("username").value = user.username;
            document.getElementById("email").value = user.email;
            document.getElementById("gender").value = user.gender;
            document.getElementById("dob").value = user.date_of_birth || "";
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data.");
        });
});

// Handle profile update
document.querySelector(".profile-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedUser = {
        firstName: document.getElementById("fullName").value.split(" ")[0],
        lastName: document.getElementById("fullName").value.split(" ")[1] || "",
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        gender: document.getElementById("gender").value,
        dateOfBirth: document.getElementById("dob").value
    };

    fetch(`http://localhost:8080/api/users/${updatedUser.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    })
    .then(response => response.json())
    .then(data => {
        alert("Profile updated successfully!");
    })
    .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
    });
});
