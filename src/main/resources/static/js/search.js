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
  
      let url = "http://localhost:8080/api/items/all";
  
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

  document.getElementById("filterBtn").addEventListener("click", function() {
    const searchQuery = document.getElementById("searchInput").value;
    const category = document.getElementById("categoryFilter").value;
    const status = document.getElementById("statusFilter").value;
    const date = document.getElementById("dateFilter").value;

    // Build the URL with query parameters
    let url = '/search?';
    if (searchQuery) url += `search=${searchQuery}&`;
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}&`;
    if (date) url += `date=${date}&`;

    // Remove the last '&' if any
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    // Fetch data from backend based on filters
    fetch(url)
        .then(response => response.json())
        .then(data => updateTable(data))
        .catch(error => console.error('Error fetching search results:', error));
});

function updateTable(items) {
    const tableBody = document.getElementById('searchTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Populate the table with new rows based on the fetched data
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.status}</td>
            <td>${item.description}</td>
            <td>${item.location}</td>
            <td>${item.dateReported}</td>
        `;
        tableBody.appendChild(row);
    });
}
