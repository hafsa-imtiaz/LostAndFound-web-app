// lostReports.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("lostReports.js loaded");
  
    // 1) Fetch the lost items from your backend
    //    Adjust the endpoint to match your actual path.
    fetch("http://localhost:8080/api/items/lost")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch lost items");
        }
        return response.json();
      })
      .then(data => {
        // data should be an array of lost items
        console.log("Lost Items:", data);
        const tableBody = document.getElementById("lostReportsTableBody");
        tableBody.innerHTML = ""; // Clear any existing rows (just in case)
  
        data.forEach(item => {
          const row = document.createElement("tr");
  
          // Create and append cells
          const idCell = document.createElement("td");
          idCell.textContent = item.itemId;
          row.appendChild(idCell);
  
          const nameCell = document.createElement("td");
          nameCell.textContent = item.itemName;
          row.appendChild(nameCell);
  
          const descCell = document.createElement("td");
          descCell.textContent = item.description;
          row.appendChild(descCell);
  
          const dateCell = document.createElement("td");
          dateCell.textContent = item.dateReported; // format date if needed
          row.appendChild(dateCell);
  
          const statusCell = document.createElement("td");
          statusCell.textContent = item.status; 
          row.appendChild(statusCell);
  
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Error fetching lost items:", error);
        alert("Could not load lost items.");
      });
  });
  