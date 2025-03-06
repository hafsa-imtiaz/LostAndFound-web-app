document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/api/users") // Adjust API URL if needed
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById("usersTableBody");

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.userId}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.dateOfBirth || "N/A"}</td>
                    <td>${user.gender}</td>
                    <td>${user.userType}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching users:", error));
});



document.getElementById("Home").addEventListener("click", () => {
window.location.href = "AdminPanel.html";
});

document.getElementById("viewLostReports").addEventListener("click", () => {
window.location.href = "lostReports.html";
});

document.getElementById("viewFoundReports").addEventListener("click", () => {
window.location.href = "foundReports.html";
});

document.getElementById("viewClaimedReports").addEventListener("click", () => {
window.location.href = "claimedReports.html";
});

document.getElementById("viewUsers").addEventListener("click", () => {
window.location.href = "userReports.html";
});

document.getElementById("profileSettings").addEventListener("click", () => {
window.location.href = "adminProfile.html";
});

document.getElementById("logout").addEventListener("click", () => {
localStorage.removeItem("loggedInUser");
window.location.href = "signup.html";
});