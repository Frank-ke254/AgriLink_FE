function requestItem(button) {
      const row = button.closest("tr");
      const item = row.children[0].textContent;
      document.getElementById("confirmation").textContent = `${item} requested successfully!`;
      setTimeout(() => {
        document.getElementById("confirmation").textContent = "";
      }, 3000);
    }

const myRequests = JSON.parse(localStorage.getItem("ruralRequests")) || [];

  function sendRequest(item) {
    const request = {
      waste: item,
      status: "Pending",
      from: "Rural Farmer",
      timestamp: new Date().toISOString()
    };

    myRequests.push(request);
    localStorage.setItem("ruralRequests", JSON.stringify(myRequests));

    const allRequests = JSON.parse(localStorage.getItem("allWasteRequests")) || [];
    allRequests.push(request);
    localStorage.setItem("allWasteRequests", JSON.stringify(allRequests));

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

  renderRequests();