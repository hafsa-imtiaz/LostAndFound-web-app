document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("searchTableBody");

    async function loadItems() {
        let url = "http://localhost:8080/api/items/all";

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Request failed: ${response.status}`);
            const items = await response.json();

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

                // When a row is clicked, store the item details in localStorage
                row.addEventListener("click", () => {
                    localStorage.setItem("selectedItem", JSON.stringify(item));
                    
                    window.location.href = "itemDetails.html"; // Redirect to details page
                });

                tableBody.appendChild(row);
            });
        } catch (err) {
            console.error("Error loading items:", err);
            alert("Failed to load items. See console for details.");
        }
    }

    loadItems();
});
