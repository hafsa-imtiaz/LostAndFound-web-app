document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter = document.getElementById("dateFilter");
    const filterBtn = document.getElementById("filterBtn");
    const tableBody = document.getElementById("searchTableBody");
  
    // Load items on page load
    loadItems();
  
    // Click "Apply Filters" to reload
    filterBtn.addEventListener("click", () => {
      loadItems();
    });
  
    async function loadItems() {
      const searchVal = searchInput.value.trim();
      const category = categoryFilter.value;
      const status = statusFilter.value;
      const date = dateFilter.value;
  
      let url = "http://localhost:8080/api/items/search?";
      const params = [];
      if (searchVal) params.push(`q=${encodeURIComponent(searchVal)}`);
      if (category) params.push(`category=${encodeURIComponent(category)}`);
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (date) params.push(`date=${encodeURIComponent(date)}`);
      url += params.join("&");
  
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const items = await response.json();
  
        tableBody.innerHTML = "";
  
        if (!items || items.length === 0) {
          const noRow = document.createElement("tr");
          noRow.innerHTML = `<td colspan="7">No items found</td>`;
          tableBody.appendChild(noRow);
          return;
        }
  
        items.forEach(item => {
          const row = document.createElement("tr");
  
          // Fill the row cells
          row.innerHTML = `
            <td>${item.itemId || ""}</td>
            <td>${item.itemName || ""}</td>
            <td>${item.itemType || ""}</td>
            <td>${item.status || ""}</td>
            <td>${item.description || ""}</td>
            <td>${item.location || ""}</td>
            <td>${
              item.dateReported
                ? new Date(item.dateReported).toLocaleDateString()
                : ""
            }</td>
          `;
  
          // Add a cursor pointer style to indicate it's clickable
          row.style.cursor = "pointer";
  
          // Make the row clickable: navigate to itemDetails.html?itemId=XXX
          row.addEventListener("click", () => {
            window.location.href = `./itemDetails.html?itemId=${encodeURIComponent(item.itemId)}`;
          });
  
          tableBody.appendChild(row);
        });
      } catch (err) {
        console.error("Error loading items:", err);
        alert("Failed to load items. See console for details.");
      }
    }
  });