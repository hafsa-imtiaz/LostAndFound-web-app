document.addEventListener("DOMContentLoaded", async () => {
    // 1. Parse the itemId from the query string
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get("itemId"); // e.g. "12345"
  
    if (!itemId) {
      alert("No itemId provided in the URL.");
      return;
    }
  
    try {
      // 2. Fetch that item from your backend
      //    e.g. GET /api/items/:itemId or /api/items/{itemId}
      const response = await fetch(`http://localhost:8080/api/items/${encodeURIComponent(itemId)}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const item = await response.json();
      if (!item) {
        alert("No item data returned.");
        return;
      }
  
      // 3. Populate the page with the item’s details
      document.getElementById("itemIdSpan").textContent = item.itemId || "";
      document.getElementById("itemNameSpan").textContent = item.itemName || "";
      document.getElementById("itemTypeSpan").textContent = item.itemType || "";
      document.getElementById("itemStatusSpan").textContent = item.status || "";
      document.getElementById("itemDescriptionSpan").textContent = item.description || "";
      document.getElementById("itemLocationSpan").textContent = item.location || "";
      document.getElementById("itemDateSpan").textContent = item.dateReported
        ? new Date(item.dateReported).toLocaleDateString()
        : "";
    } catch (error) {
      console.error("Error loading item detail:", error);
      alert("Failed to load item detail. Check console for more info.");
    }
  });
  