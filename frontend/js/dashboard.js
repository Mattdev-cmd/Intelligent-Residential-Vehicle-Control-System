// dashboard.js
function fetchLogs() {
  fetch("http://localhost:5000/api/rfid/logs")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#logTable tbody");
      tbody.innerHTML = "";

      data.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${log.uid}</td>
          <td>${log.name || "-"}</td>
          <td>${log.plateNumber || "-"}</td>
          <td>${log.type}</td>
          <td>${log.status}</td>
          <td>${new Date(log.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    });
}


// Poll every 5 seconds
setInterval(fetchLogs, 5000);
fetchLogs();

function logout() {
  localStorage.clear();
}
