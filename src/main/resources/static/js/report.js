// report.js
document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportItemForm");
  if (!reportForm) return;

  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Gather form data
    const statusValue   = document.getElementById("statusSelect").value;   // "lost"/"found"/"claimed"/"returned"
    const itemName      = document.getElementById("itemName").value;
    const itemTypeValue = document.getElementById("itemTypeSelect").value; // "Electronics"/"Clothing"/...
    const description   = document.getElementById("description")?.value || "";
    const location      = document.getElementById("location")?.value || "";
    const date          = document.getElementById("date")?.value || "";
    
    let imageFileName   = "";
    const fileInput = document.getElementById("itemImage");
    if (fileInput && fileInput.files[0]) {
      imageFileName = fileInput.files[0].name; // Storing the file name (not a real file upload)
    }

    // 2. Build JSON
    // We'll pass two separate fields:
    //  - 'status' or 'category' for the ID or name referencing the categories table
    //  - 'itemType' for electronics, clothing, etc.
    const requestBody = {
      status: statusValue,
      itemName,
      itemType: itemTypeValue,
      description,
      location,
      date,
      imageFileName
    };

    try {
      // 3. POST to your backend
      const response = await fetch("http://localhost:8080/api/items/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to report item.");
        return;
      }

      // On success
      const responseData = await response.json();
      alert("Item reported successfully!");
      console.log("Reported Data:", responseData);
      reportForm.reset();
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again later.");
    }
  });
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "signup.html";
});
