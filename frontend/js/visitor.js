let editingUID = null;

document.addEventListener("DOMContentLoaded", () => {
  fetchVisitors();

  const form = document.getElementById("visitorForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      contact: form.contact.value,
      reason: form.reason.value,  // <-- MATCHES backend's `reason`
      uid: form.uid.value,
      vehicle: {
        plateNumber: form.plateNumber.value,
        model: form.model.value,
        color: form.color.value,
      },
    };

    try {
      let res, result;

      if (editingUID) {
        res = await fetch(`http://localhost:5000/api/visitors/${editingUID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        result = await res.json();
        if (res.ok) {
          alert("Visitor updated successfully!");
          editingUID = null;
        } else {
          alert(result.error || "Update failed.");
        }
      } else {
        res = await fetch("http://localhost:5000/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        result = await res.json();
        if (res.ok) {
          alert("Visitor registered successfully!");
        } else {
          alert(result.error || "Registration failed.");
        }
      }

      form.reset();
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert("Server error occurred.");
    }
  });
});

function fetchVisitors() {
  fetch("http://localhost:5000/api/visitors")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#visitorTable tbody");
      tbody.innerHTML = "";

      data.forEach(v => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${v.name}</td>
          <td>${v.uid}</td>
          <td>${v.vehicle.plateNumber}</td>
          <td>${v.vehicle.model}</td>
          <td>${v.vehicle.color}</td>
          <td>${v.contact}</td>
          <td>${v.reason}</td>
          <td>
            <button onclick="editVisitor('${v.uid}')">Edit</button>
            <button onclick="deleteVisitor('${v.uid}')">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    });
}

function editVisitor(uid) {
  fetch("http://localhost:5000/api/visitors")
    .then(res => res.json())
    .then(data => {
      const visitor = data.find(v => v.uid === uid);
      if (!visitor) return;

      const form = document.getElementById("visitorForm");
      form.name.value = visitor.name;
      form.uid.value = visitor.uid;
      form.contact.value = visitor.contact;
      form.reason.value = visitor.reason;
      form.plateNumber.value = visitor.vehicle.plateNumber;
      form.model.value = visitor.vehicle.model;
      form.color.value = visitor.vehicle.color;

      editingUID = uid;
    });
}

function deleteVisitor(uid) {
  if (!confirm("Are you sure you want to delete this visitor?")) return;

  fetch(`http://localhost:5000/api/visitors/${uid}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.msg || "Visitor deleted.");
      fetchVisitors();
    })
    .catch(err => {
      console.error(err);
      alert("Error deleting visitor.");
    });
}

function logout() {
  localStorage.clear();
}
