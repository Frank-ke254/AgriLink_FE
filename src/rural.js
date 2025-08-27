const myRequests = [];

    function sendRequest(item) {
      myRequests.push({ waste: item, status: "Pending" });
      renderRequests();
      alert("Request for " + item + " sent!");
    }

    function renderRequests() {
      const tbody = document.getElementById("myRequestsBody");
      tbody.innerHTML = "";
      myRequests.forEach(req => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${req.waste}</td>
          <td>${req.status}</td>
        `;
        tbody.appendChild(row);
      });
    }