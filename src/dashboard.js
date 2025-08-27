document.getElementById("wasteForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const type = document.getElementById("type").value;
      const quantity = document.getElementById("quantity").value;
      const location = document.getElementById("location").value;
      const notes = document.getElementById("notes").value;

      // Normally this data would be sent to a backend
      console.log({ type, quantity, location, notes });

      document.getElementById("confirmation").innerText = "Listing submitted successfully!";
      document.getElementById("wasteForm").reset();
    });

function loadRequests() {
      const requestData = JSON.parse(localStorage.getItem("allWasteRequests")) || [];
      const tbody = document.getElementById("requestTableBody");
      tbody.innerHTML = "";

      requestData.forEach(req => {
        const row = document.createElement("tr");
        const date = new Date(req.timestamp);
        row.innerHTML = `
          <td>${req.waste}</td>
          <td>${req.from}</td>
          <td>${date.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    }

    loadRequests();