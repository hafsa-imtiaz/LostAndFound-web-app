// report.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("report.js loaded");

  const reportItemForm = document.getElementById("reportItemForm");
  if (!reportItemForm) return; // Safety check

  reportItemForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page refresh

    // 1. Gather form data
    const itemType    = document.getElementById("itemType").value;       // "lost" / "found"
    const itemName    = document.getElementById("itemName").value;
    const category    = document.getElementById("category").value;       // e.g. "Electronics"
    const description = document.getElementById("description").value;
    const location    = document.getElementById("location").value;
    const date        = document.getElementById("date").value;           // "yyyy-mm-dd"

    // For a real file upload, you'd typically do a FormData + multipart request.
    // Here we’ll just store the file name/path as a placeholder.
    const fileInput = document.getElementById("itemImage");
    let imageFileName = "";
    if (fileInput.files && fileInput.files[0]) {
      imageFileName = fileInput.files[0].name;
    }

    // 2. Build JSON payload
    const requestData = {
      itemType,    // which will map to "status" in the backend
      itemName,
      category,    
      description,
      location,
      date,        // date lost/found
      image: imageFileName
    };

    try {
      // 3. POST to your backend
      const response = await fetch("http://localhost:8080/api/items/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Item reported successfully!");
        // Optionally reset the form
        reportItemForm.reset();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to report item.");
      }
    } catch (error) {
      console.error("Error reporting item:", error);
      alert("Server error. Please try again later.");
    }
  });
});
