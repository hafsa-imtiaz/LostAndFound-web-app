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
            document.getElementById("fullName").value = (user.firstName || "") + " " + (user.lastName || "");
            document.getElementById("username").value = user.username || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("gender").value = user.gender || "";
            document.getElementById("dob").value = user.dateOfBirth || "";
            console.log("Received date_of_birth:", user.dateOfBirth);
            console.log("Received date_of_birth:", document.getElementById("dob").value);
            if (user.profilePicture) {
                // Display profile picture if exists
                const profileImage = document.getElementById("profile-img");
                profileImage.src = `data:image/jpeg;base64,${user.profilePicture}`; // assuming the server sends the image as base64
            }
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

// Handle profile update
document.querySelector(".profile-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const currusername = localStorage.getItem("loggedInUser");
    const fullNameParts = document.getElementById("fullName").value.trim().split(" ");
    const firstName = fullNameParts[0] ? fullNameParts[0] : "";
    const lastName = fullNameParts.length > 1 ? fullNameParts.slice(1).join(" ") : "";
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const dateOfBirth = document.getElementById("dob").value.trim();
    const profilePicture = document.getElementById("upload-photo").files[0];

    if (!firstName || !lastName || !username || !email || !gender || !dateOfBirth) {
        alert("All fields are required. Please fill in the missing information.");
        return;
    }

    const updatedUser = { firstName, lastName, username, email, gender, dateOfBirth };   
    if (profilePicture) {
        const reader = new FileReader();
        reader.onloadend = function () {
            updatedUser.profilePicture = reader.result.split(',')[1]; // Remove the "data:image/jpeg;base64," part
            updateUserData(updatedUser);
        };
        reader.readAsDataURL(profilePicture); // Read the image file as Base64
    } else {
        updateUserData(updatedUser); // No profile picture, just update user data
    } 
});

// Function to send the user data to the backend
function updateUserData(updatedUser) {
    const currusername = localStorage.getItem("loggedInUser");

    fetch(`http://localhost:8080/api/users/${currusername}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errMessage => { throw new Error(errMessage); });
        }
        return response.json();
    })
    .then(data => {
        alert("Profile updated successfully!");
        // Optionally, update the displayed profile picture
        if (updatedUser.profilePicture) {
            const profileImage = document.getElementById("profile-img");
            profileImage.src = `data:image/jpeg;base64,${updatedUser.profilePicture}`; // Update the image preview
        }
    })
    .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile: " + error.message);
    });
}


document.querySelector(".change-password form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const username = localStorage.getItem("loggedInUser"); // Assuming username is stored on login

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("All fields are required.");
        return;
    }

    if (newPassword.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match.");
        return;
    }

    const payload = { currentPassword, newPassword };

    fetch(`http://localhost:8080/api/users/${username}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errMessage => { throw new Error(errMessage); });
        }
        return response.json();
    })
    .then(data => {
        alert("Password updated successfully!");
        document.querySelector(".change-password form").reset();
    })
    .catch(error => {
        console.error("Error updating password:", error);
        alert("Failed to update password: " + error.message);
    });
});


// Handle profile picture change event
document.getElementById("upload-photo").addEventListener("change", function () {
    const file = this.files[0]; // Get the selected file
    if (file) {
        // Immediately update the profile picture on the frontend (using FileReader)
        const reader = new FileReader();
        reader.onloadend = function () {
            const profileImage = document.getElementById("profile-img");
            profileImage.src = reader.result; // Set the src to the base64 data URL from FileReader
        };
        reader.readAsDataURL(file); // Read the file and update the image preview

        // Send the file to the server to update the profile picture in the backend
        const formData = new FormData(); // Create FormData to send as multipart/form-data
        formData.append("file", file); 
        formData.append("username", localStorage.getItem("loggedInUser")); 

        fetch('http://localhost:8080/api/users/update-profile-picture', { 
            method: 'POST',
            body: formData // Send the formData directly (no need to specify Content-Type, browser handles it)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Profile picture updated successfully');
            } else {
                console.error('Error updating profile picture:', data.message);
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
    }
});

