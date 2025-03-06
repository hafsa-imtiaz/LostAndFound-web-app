document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportItemForm");
  if (!reportForm) return;

  reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");  // Assuming userId is stored in localStorage under 'userId'
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // 1. Gather form data
    const statusValue   = document.getElementById("statusSelect").value;   // "lost"/"found"/"claimed"/"returned"
    const itemName      = document.getElementById("itemName").value;
    const itemTypeValue = document.getElementById("itemTypeSelect").value; // "Electronics"/"Clothing"/...
    const description   = document.getElementById("description")?.value || "";
    const location      = document.getElementById("location")?.value || "";
    const date          = document.getElementById("date")?.value || "";
    
    let imageBase64 = ""; // Variable to store the base64 string
    const fileInput = document.getElementById("itemImage");
    if (fileInput && fileInput.files[0]) {
      const file = fileInput.files[0]; // Storing the file name (not a real file upload)
      imageBase64 = await convertImageToBase64(file);  // Get the base64 string
    }

    // 2. Build JSON - include userId along with other fields
    const requestBody = {
      userId,            // Add userId here
      status: statusValue,
      itemName,
      itemType: itemTypeValue,
      description,
      location,
      date,
      imageBase64        // Sending base64 encoded image here
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

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract the base64 string
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
