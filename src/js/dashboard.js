async function loadRequests() {
  const tbody = document.getElementById("requestTableBody");
  tbody.innerHTML = "";

  try {
    const data = await window.AgriApi.listRequests("urban");
    (data.results || []).forEach((req) => {
      const row = document.createElement("tr");
      const date = new Date(req.created_at);
      row.innerHTML = `
        <td>${req.listing_title}</td>
        <td>${req.farmer_name}</td>
        <td>${date.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="3">Unable to load incoming requests.</td></tr>';
  }
}

loadRequests();