// foundReports.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("foundReports.js loaded.");
  
    // Fetch your "found" items from the backend
    // Adjust the URL to match your actual endpoint
    fetch("http://localhost:8080/api/items/found")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch found items: " + response.status);
        }
        return response.json();
      })
      .then(data => {
        // data should be an array of found items
        console.log("Found items data:", data);
  
        const tableBody = document.getElementById("foundItemsBody");
        tableBody.innerHTML = ""; // Clear any existing rows
  
        data.forEach(item => {
          const row = document.createElement("tr");
  
          // Create cells
          const idCell = document.createElement("td");
          idCell.textContent = item.itemId;
          row.appendChild(idCell);
  
          const nameCell = document.createElement("td");
          nameCell.textContent = item.itemName;
          row.appendChild(nameCell);
  
          const typeCell = document.createElement("td");
          typeCell.textContent = item.itemType;
          row.appendChild(typeCell);
  
          const dateCell = document.createElement("td");
          dateCell.textContent = item.dateReported;
          row.appendChild(dateCell);
  
          const statusCell = document.createElement("td");
          statusCell.textContent = item.status;
          row.appendChild(statusCell);
  
          // Append row to table
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Error loading found items:", error);
        alert("Could not load found items.");
      });
  });
  