document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the selected item from localStorage
  const selectedItem = JSON.parse(localStorage.getItem("selectedItem"));
  
  // Check if item exists
  if (!selectedItem) {
      alert("No item details found. Please select an item from the search page.");
      window.location.href = "search.html"; // Redirect back to search page
      return;
  }
  
  // Update the page with item details
  displayItemDetails(selectedItem);
  
  // Add event listeners to buttons
  const claimButton = document.querySelector(".action-btn");
  claimButton.addEventListener("click", handleClaimItem);
  
  const emailButton = document.getElementById("email-btn");
  emailButton.addEventListener("click", () => handleEmailUser(selectedItem));
});

// Function to display item details on the page
function displayItemDetails(item) {
  // Update the page title
  document.title = `${item.itemName} | Lost & Found`;
  
  // Update the item details
  const detailsContainer = document.querySelector(".detailsContainer");
  
  // Update heading
  const heading = detailsContainer.querySelector("h2");
  heading.textContent = item.itemName || "Item Name Not Available";
  
  // Update paragraphs
  const paragraphs = detailsContainer.querySelectorAll("p");
  
  // Description
  paragraphs[0].innerHTML = `<strong>Description:</strong> ${item.description || "No description available"}`;
  
  // Location
  paragraphs[1].innerHTML = `<strong>Location:</strong> ${item.location || "Location not specified"}`;
  
  // Date
  paragraphs[2].innerHTML = `<strong>Date Lost/Found:</strong> ${
      item.dateReported ? new Date(item.dateReported).toLocaleDateString() : "Date not available"
  }`;
  
  // Status
  paragraphs[3].innerHTML = `<strong>Status:</strong> ${item.status || "Status not available"}`;
  
  // Reported By
  paragraphs[4].innerHTML = `<strong>Reported By:</strong> <a href="#">${item.reportedBy || "Unknown"}</a>`;
  
  // Update claim button based on status
  const claimButton = document.querySelector(".action-btn");
  if (item.status === "Claimed") {
      claimButton.textContent = "Already Claimed";
      claimButton.disabled = true;
      claimButton.classList.add("disabled");
  }
  
  // If we have image information, update the images
  // This assumes you would have image paths in your item data
  // If not, you could keep default images or hide the image section
  if (item.imagePath) {
      const mainImage = document.querySelector(".main-image");
      mainImage.src = item.imagePath;
      mainImage.alt = item.itemName;
  }
}

// Function to handle claim button click
async function handleClaimItem() {
  const selectedItem = JSON.parse(localStorage.getItem("selectedItem"));
  
  // First, confirm that the user wants to claim the item
  const confirmClaim = confirm("Are you sure you want to claim this item? This will notify the reporter.");
  
  if (!confirmClaim) return;
  
  try {
      // Show loading state
      const claimButton = document.querySelector(".action-btn");
      claimButton.textContent = "Processing...";
      claimButton.disabled = true;
      
      // Call the API to update the item status to "Claimed"
      const response = await fetch(`http://localhost:8080/api/items/${encodeURIComponent(selectedItem.itemId)}/claim`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              // Include any additional data needed for claiming
              userId: getCurrentUserId(), // You'll need to implement this function
              claimDate: new Date().toISOString(),
              claimNotes: "Claimed through web interface"
          })
      });
      
      if (!response.ok) {
          throw new Error(`Failed to claim item: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update the UI to reflect the claimed status
      claimButton.textContent = "Successfully Claimed";
      claimButton.classList.add("success");
      
      // Update the status text in the UI
      document.querySelector(".detailsContainer p:nth-of-type(4)").innerHTML = "<strong>Status:</strong> Claimed";
      
      // Update the item in localStorage
      selectedItem.status = "Claimed";
      localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
      
      // Show a success message
      alert("Item successfully claimed! The reporter has been notified.");
      
  } catch (error) {
      console.error("Error claiming item:", error);
      
      // Reset the button
      const claimButton = document.querySelector(".action-btn");
      claimButton.textContent = "Claim Item";
      claimButton.disabled = false;
      
      // Show error message
      alert("Failed to claim the item. Please try again later.");
  }
}

// Function to handle email user button click
function handleEmailUser(item) {
  // Get the reporter's email (this would come from your user database)
  // This is a placeholder - implement according to your data structure
  const reporterEmail = item.reporterEmail || "";
  
  if (!reporterEmail) {
      alert("Reporter email is not available.");
      return;
  }
  
  // Compose an email template
  const subject = `Regarding your ${item.status} item: ${item.itemName}`;
  const body = `Hello,\n\nI am contacting you regarding the ${item.itemName} that you reported as ${item.status} on ${new Date(item.dateReported).toLocaleDateString()}.\n\nPlease let me know if we can arrange a meetup for the item.\n\nRegards,\n[Your Name]`;
  
  // Open default email client
  window.location.href = `mailto:${reporterEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Helper function to get the current user ID from session/local storage
function getCurrentUserId() {
  // This is a placeholder - implement according to your authentication system
  // For example, if you store user data in localStorage:
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  return userData.id || "anonymous";
}