document.addEventListener("DOMContentLoaded", () => {
    // Suppose you have the user ID from login (stored in localStorage)
    const userId = localStorage.getItem("userId"); 
    // if there's a token-based system, pass the token in headers, etc.
  
    // If no userId found, redirect to login
    if (!userId) {
      window.location.href = "UserHome.html";
      return;
    }
  
    // 1. Fetch the dashboard data
    fetch(`http://localhost:8080/api/users/${userId}/dashboard`)
      .then(response => response.json())
      .then(data => {
        console.log("Dashboard data:", data);
  
        // 2. Insert the user's name
        const welcomeEl = document.getElementById("welcomeUser");
        if (welcomeEl) {
          welcomeEl.textContent = `Welcome back, ${data.fullName}`;
        }
  
        // 3. Show the counts
        document.getElementById("lostCount").textContent = data.lostCount;
        document.getElementById("foundCount").textContent = data.foundCount;
        document.getElementById("claimedCount").textContent = data.claimedCount;
        // etc. if you have a “successfulMatches” or “returnedCount”
  
        // 4. Populate the “Recent Activity” table
        const recentTableBody = document.getElementById("recentTableBody");
        if (recentTableBody) {
          recentTableBody.innerHTML = ""; // clear old rows
  
          data.recentItems.forEach(item => {
            // Create a new row
            const row = document.createElement("tr");
            
            // Name cell
            const nameCell = document.createElement("td");
            nameCell.textContent = item.itemName;
            row.appendChild(nameCell);
  
            // Type cell
            const typeCell = document.createElement("td");
            typeCell.textContent = item.itemType;
            row.appendChild(typeCell);
  
            // Date cell
            const dateCell = document.createElement("td");
            dateCell.textContent = item.dateReported;
            row.appendChild(dateCell);
  
            // Status cell
            const statusCell = document.createElement("td");
            statusCell.textContent = item.status; // or "Pending" / "Claimed" if you do custom logic
            row.appendChild(statusCell);
  
            recentTableBody.appendChild(row);
          });
        }
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        alert("Failed to load dashboard.");
      });
  });
  