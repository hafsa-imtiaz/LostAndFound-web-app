document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");
  const dateFilter = document.getElementById("dateFilter");
  const filterBtn = document.getElementById("filterBtn");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn"); 
  const tableBody = document.getElementById("searchTableBody");

  loadAllItems();

  async function loadAllItems() {
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

              row.style.cursor = "pointer";
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

  document.getElementById("filterBtn").addEventListener("click", function() {
      const searchQuery = document.getElementById("searchInput").value;
      const category = document.getElementById("categoryFilter").value;
      const status = document.getElementById("statusFilter").value;
      const date = document.getElementById("dateFilter").value;

      if (category === "All Categories") category = null;
      if (status === "All Statuses") status = null;

      let url = 'http://localhost:8080/api/items/filter?';
      if (searchQuery) url += `searchQuery=${searchQuery}&`;
      if (category) url += `itemType=${category}&`;
      if (status) url += `status=${status}&`;
      if (date) url += `filterDate=${date}&`;

      // remove any lingering '&' 
      url = url.endsWith('&') ? url.slice(0, -1) : url;
      fetch(url)
          .then(response => response.json())
          .then(data => updateTable(data))
          .catch(error => console.error('Error fetching search results:', error));
  });

  clearFiltersBtn.addEventListener("click", function() {
      searchInput.value = '';
      categoryFilter.value = '';
      statusFilter.value = '';
      dateFilter.value = '';
      loadAllItems();
  });

  function updateTable(items) {
    const tableBody = document.getElementById("searchTableBody");
    tableBody.innerHTML = "";

    if (!items || items.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>No items found</td></tr>";
        return;
    }

    items.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.itemId}</td>
            <td>${item.itemName}</td>
            <td>${item.itemType}</td>
            <td>${item.status}</td>
            <td>${item.description}</td>
            <td>${item.location}</td>
            <td>${item.dateReported ? new Date(item.dateReported).toLocaleDateString() : ""}</td>
        `;

        row.style.cursor = "pointer";

        // Store the selected item's details in localStorage on click
        row.addEventListener("click", () => {
            localStorage.setItem("selectedItem", JSON.stringify(item));
            window.location.href = "itemDetails.html"; // Redirect to details page
        });

        tableBody.appendChild(row);
    });
}

});


