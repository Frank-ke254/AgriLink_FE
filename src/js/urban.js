function inferListingType(input) {
  const value = input.toLowerCase();
  return value.includes("peel") || value.includes("compost") || value.includes("organic")
    ? "fertilizer"
    : "feed";
}

async function ensureSupplier() {
  const me = await window.AgriApi.me();
  const suppliers = await window.AgriApi.listSuppliers();
  const existing = (suppliers.results || []).find((s) => s.owner === me.username);
  if (existing) return existing;

  const fallbackName = localStorage.getItem("farmcycle_full_name") || "Urban Provider";
  return window.AgriApi.createSupplier({
    name: fallbackName,
    contact: me.email || "N/A",
    location: "Unspecified",
  });
}

async function loadIncomingRequests() {
  const requestTableBody = document.getElementById("requestTableBody");
  requestTableBody.innerHTML = "";
  try {
    const data = await window.AgriApi.listRequests("urban");
    (data.results || []).forEach((req) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.farmer_name}</td>
        <td>${req.listing_title}</td>
        <td>${req.status}</td>
        <td>${req.message || "-"}</td>
      `;
      requestTableBody.appendChild(row);
    });
  } catch {
    requestTableBody.innerHTML = '<tr><td colspan="4">Could not load requests.</td></tr>';
  }
}

document.getElementById("listingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const wasteType = document.getElementById("wasteType").value.trim();
  const quantityRaw = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const listingMessage = document.getElementById("listingMessage");

  const quantity = Number(quantityRaw.replace(/[^\d.]/g, "")) || 0;
  listingMessage.textContent = "Submitting listing...";

  try {
    const supplier = await ensureSupplier();
    await window.AgriApi.createListing({
      supplier: supplier.id,
      title: wasteType,
      description: notes,
      type: inferListingType(wasteType),
      quantity,
      location,
    });
    listingMessage.textContent = "Listing added successfully!";
    document.getElementById("listingForm").reset();
  } catch (error) {
    listingMessage.textContent = error.message || "Could not submit listing.";
  }
});

loadIncomingRequests();