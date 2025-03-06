// adminPanel.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin panel script loaded.");

  // 1) Example placeholders for data (replace with real fetch calls)
  const totalUsers = 25;
  const lostCount = 15;
  const foundCount = 8;
  const claimedCount = 3;

  document.getElementById("totalUsersCount").textContent = totalUsers;
  document.getElementById("lostReportsCount").textContent = lostCount;
  document.getElementById("foundReportsCount").textContent = foundCount;
  document.getElementById("claimedReportsCount").textContent = claimedCount;

  // 2) Dummy data for the table
  const reportsData = [
    { id: 1, name: "Black Wallet", type: "Lost Item", date: "2025-03-01", status: "Lost" },
    { id: 2, name: "Red Bag", type: "Found Item", date: "2025-03-02", status: "Found" },
    { id: 3, name: "ID Card", type: "Claimed", date: "2025-03-03", status: "Claimed" },
  ];

  const tableBody = document.getElementById("reportsTableBody");
  reportsData.forEach(report => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = report.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = report.name;
    row.appendChild(nameCell);

    const typeCell = document.createElement("td");
    typeCell.textContent = report.type;
    row.appendChild(typeCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = report.date;
    row.appendChild(dateCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = report.status;
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });

});



  // 3) Sidebar navigation logic
  document.getElementById("Home").addEventListener("click", () => {
    window.location.href = "AdminPanel.html";
  });

  //    Replace these with real pages you have or plan to create
  document.getElementById("viewLostReports").addEventListener("click", () => {
    // Example: navigate to a separate "lostReports.html" page
    window.location.href = "lostReports.html";
  });

  document.getElementById("viewFoundReports").addEventListener("click", () => {
    window.location.href = "foundReports.html";
  });

  document.getElementById("viewClaimedReports").addEventListener("click", () => {
    window.location.href = "claimedReports.html";
  });

  document.getElementById("viewUsers").addEventListener("click", () => {
    window.location.href = "userReports.html";
  });

  document.getElementById("profileSettings").addEventListener("click", () => {
    window.location.href = "adminProfile.html";
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "signup.html";
  });