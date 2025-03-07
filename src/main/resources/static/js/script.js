/*
document.addEventListener("DOMContentLoaded", () => {
    const messageUserBtn = document.getElementById("email-btn");

    if (messageUserBtn) {
        // Replace these with dynamic data from your backend :)
        const userEmail = "jack@gmail.com"; // User's email
        const itemName = "Black Leather Wallet"; // Item name
        const userName = "Jack Paul"; // User's name

        // Construct the Gmail URL
        const subject = `Regarding Your Lost Item: ${itemName}`;
        const body = `Hello ${userName},\n\nI found your lost item (${itemName}) and would like to return it to you.\n\nPlease let me know how we can proceed.\n\nBest regards,\n[Your Name]`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(userEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Set the button's click behavior
        messageUserBtn.addEventListener("click", () => {
            window.open(gmailUrl, "_blank"); // Open Gmail in a new tab
        });
    }
});
*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded successfully");

    const sidebarItems = document.querySelectorAll(".nav-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.textContent.trim();
            switch (page) {
                case "Home":
                    window.location.href = "UserHome.html";
                    break;
                case "Report Items":
                    window.location.href = "ReportItem.html";
                    break;
                case "Search Items":
                    window.location.href = "SearchItem.html";
                    break;
                case "Profile Settings":
                    window.location.href = "Profile.html";
                    break;
                case "Help Center":
                    window.location.href = "HelpCenter.html";
                    break;
                default:
                    console.warn("Navigation not found:", page);
            }
        });
    });
    
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "signup.html";
    });

    const viewDetailsButton = document.getElementById("View Details");
    if (viewDetailsButton) {
        viewDetailsButton.addEventListener("click", () => {
            window.location.href = "itemDetails.html";
        });
    }
});

