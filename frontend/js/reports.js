document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("filterForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchLogs();
  });

  fetchLogs(); // Load on page load
});

function fetchLogs() {
  const type = document.getElementById("filterType").value;
  const status = document.getElementById("filterStatus").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  let query = [];
  if (type) query.push(`type=${type}`);
  if (status) query.push(`status=${status}`);
  if (start) query.push(`start=${start}`);
  if (end) query.push(`end=${end}`);

  fetch(`http://localhost:5000/api/rfid/logs?${query.join("&")}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#logsTable tbody");
      tbody.innerHTML = "";

      data.forEach(log => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${log.name || "-"}</td>
          <td>${log.uid}</td>
          <td>${log.plateNumber || "-"}</td>
          <td>${log.type || "unknown"}</td>
          <td>${log.status}</td>
          <td>${new Date(log.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    });
}

function logout() {
  localStorage.clear();
}
