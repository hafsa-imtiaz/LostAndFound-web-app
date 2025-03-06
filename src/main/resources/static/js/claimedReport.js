document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("claimedReportsTableBody");
  
    try {
        const response = await fetch("http://localhost:8080/api/items/claimed"); // Adjust API URL if needed
        if (!response.ok) 
          throw new Error("Failed to fetch lost items");
  
        console.log("hogaya");
        const lostItems = await response.json();
        tableBody.innerHTML = ""; // Clear existing data
  
        lostItems.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.itemId}</td>
                <td>${item.itemName}</td>
                <td>${item.itemType}</td>
                <td>${item.description || "No description"}</td> <!-- Handle null values -->
                <td>${item.location || "Unknown"}</td>           <!-- Handle null values -->
                <td>${new Date(item.dateReported).toLocaleDateString()}</td>
                <td>${item.username || "No user"}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading lost items:", error);
    }
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