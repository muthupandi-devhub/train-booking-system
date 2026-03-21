const container = document.getElementById("historyContainer");

if (container) {
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  if (tickets.length === 0) {
    container.innerHTML = "<p class='text-center text-red-500'>No bookings found</p>";
  }

  tickets.forEach(ticket => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded-xl shadow mb-4">
        <h2 class="font-bold">${ticket.train}</h2>
        <p>${ticket.from} → ${ticket.to}</p>
        <p>Name: ${ticket.name}</p>
        <p>PNR: ${ticket.pnr}</p>
        <p>Status: ${ticket.status}</p>
      </div>
    `;
  });
}