document.getElementById("listingForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const type = document.getElementById("wasteType").value;
      const quantity = document.getElementById("quantity").value;
      const location = document.getElementById("location").value;
      const notes = document.getElementById("notes").value;

      console.log({ type, quantity, location, notes });

      document.getElementById("listingMessage").textContent = "Listing added successfully!";
      document.getElementById("listingForm").reset();
    });

    // Dummy sample requests
    const dummyRequests = [
      { name: "Mzee Kamau", type: "Vegetables", quantity: "20kg", message: "Needed urgently for composting." },
      { name: "Mama Wambui", type: "Fruit Peels", quantity: "15kg", message: "Can pick up tomorrow morning." }
    ];

    const requestTableBody = document.getElementById("requestTableBody");
    dummyRequests.forEach(req => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.name}</td>
        <td>${req.type}</td>
        <td>${req.quantity}</td>
        <td>${req.message}</td>
      `;
      requestTableBody.appendChild(row);
    });