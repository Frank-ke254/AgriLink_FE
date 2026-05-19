async function ensureFarmer() {
  const me = await window.AgriApi.me();
  const farmers = await window.AgriApi.listFarmers();
  const existing = (farmers.results || []).find((f) => f.owner === me.username);
  if (existing) return existing;

  const fallbackName = localStorage.getItem("farmcycle_full_name") || "Rural Farmer";
  return window.AgriApi.createFarmer({
    name: fallbackName,
    contact: me.email || "N/A",
    location: "Unspecified",
  });
}

window.sendRequest = async function sendRequest(listingId, listingTitle) {
  try {
    const farmer = await ensureFarmer();
    await window.AgriApi.createRequest({
      listing: listingId,
      farmer: farmer.id,
      message: `Request for ${listingTitle}`,
    });
    await renderRequests();
    alert(`Request for ${listingTitle} sent!`);
  } catch (error) {
    alert(error.message || "Could not send request.");
  }
};

async function loadListings() {
  const tbody = document.getElementById("listingTableBody");
  tbody.innerHTML = "";
  try {
    const data = await window.AgriApi.listListings();
    (data.results || []).forEach((listing) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${listing.title}</td>
        <td>${listing.quantity}kg</td>
        <td>${listing.location}</td>
        <td><button class="cta-button" style="padding: 0.5rem 1rem; font-size: 0.85rem; border: none; cursor: pointer;" onclick="sendRequest(${listing.id}, '${listing.title.replace(/'/g, "\\'")}')">Request</button></td>
      `;
      tbody.appendChild(row);
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="4">Unable to load listings.</td></tr>';
  }
}

async function renderRequests() {
  const tbody = document.getElementById("myRequestsBody");
  tbody.innerHTML = "";
  try {
    const data = await window.AgriApi.listRequests("rural");
    (data.results || []).forEach((req) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.listing_title}</td>
        <td>${req.status}</td>
      `;
      tbody.appendChild(row);
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="2">Unable to load your requests.</td></tr>';
  }
}

loadListings();
renderRequests();