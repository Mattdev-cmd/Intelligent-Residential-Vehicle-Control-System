let editingUID = null;

document.addEventListener("DOMContentLoaded", () => {
  fetchResidents();

  const form = document.getElementById("residentForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      address: form.address.value,
      contact: form.contact.value,
      uid: form.uid.value,
      vehicle: {
        plateNumber: form.plateNumber.value,
        model: form.model.value,
        color: form.color.value,
      },
    };

    try {
      let res;
      let result;

      if (editingUID) {
        res = await fetch(`http://localhost:5000/api/residents/${editingUID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        result = await res.json();
        if (res.ok) {
          alert("Resident updated successfully!");
          editingUID = null;
        } else {
          alert(result.error || "Failed to update.");
        }
      } else {
        res = await fetch("http://localhost:5000/api/residents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        result = await res.json();
        if (res.ok) {
          alert("Resident registered successfully!");
        } else {
          alert(result.error || "Failed to register.");
        }
      }

      form.reset();
      fetchResidents();
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  });
});

function fetchResidents() {
  fetch("http://localhost:5000/api/residents")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#residentTable tbody");
      tbody.innerHTML = "";

      data.forEach((r) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.name}</td>
          <td>${r.uid}</td>
          <td>${r.vehicle.plateNumber}</td>
          <td>${r.vehicle.model}</td>
          <td>${r.vehicle.color}</td>
          <td>${r.contact}</td>
          <td>${r.address}</td>
          <td>
            <button onclick="editResident('${r.uid}')">Edit</button>
            <button onclick="deleteResident('${r.uid}')">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    });
}

function editResident(uid) {
  fetch("http://localhost:5000/api/residents")
    .then((res) => res.json())
    .then((data) => {
      const resident = data.find((r) => r.uid === uid);
      if (!resident) return;

      const form = document.getElementById("residentForm");

      form.name.value = resident.name;
      form.address.value = resident.address;
      form.contact.value = resident.contact;
      form.uid.value = resident.uid;
      form.plateNumber.value = resident.vehicle.plateNumber;
      form.model.value = resident.vehicle.model;
      form.color.value = resident.vehicle.color;

      editingUID = uid;
    });
}

function deleteResident(uid) {
  if (!confirm("Are you sure you want to delete this resident?")) return;

  fetch(`http://localhost:5000/api/residents/${uid}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((result) => {
      alert(result.msg || "Resident deleted.");
      fetchResidents();
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting resident.");
    });
}

function logout() {
  localStorage.clear();
}
