// --- 1. DROPDOWN MENU LOGIC ---
const avatarBtn = document.getElementById('avatar-btn');
const userDropdown = document.getElementById('user-dropdown');

// Toggle dropdown when clicking the avatar
avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops the click from registering on the document below
    userDropdown.classList.toggle('show');
    avatarBtn.classList.toggle('active'); // Optional: Keeps button highlighted
            
    // Accessibility update
    const isExpanded = userDropdown.classList.contains('show');
    avatarBtn.setAttribute('aria-expanded', isExpanded);
});

// Close dropdown if user clicks anywhere else on the screen
document.addEventListener('click', (e) => {
    // Check if the click happened outside of both the dropdown and the button
    if (!userDropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        userDropdown.classList.remove('show');
        avatarBtn.classList.remove('active');
        avatarBtn.setAttribute('aria-expanded', 'false');
    }
});


 // --- 2. TAB SWITCHING LOGIC ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}


 // --- 3. MOCK DATABASE DATA & RENDERING ---
const mockCarBookings = [
    { id: "CR-9012", vehicle: "Toyota Veloz", dates: "Aug 15 - Aug 18, 2026", price: "Php 9,000", status: "Upcoming" },
    { id: "CR-8842", vehicle: "Toyota Vios", dates: "Jul 01 - Jul 03, 2026", price: "Php 6,000", status: "Completed" },
    { id: "CR-7109", vehicle: "Toyota Wigo", dates: "May 10 - May 11, 2026", price: "Php 1,500", status: "Cancelled" }
];

const mockStayBookings = [
    { id: "ST-5021", suite: "Executive Suite", dates: "Sep 01 - Sep 03, 2026", guests: 2, price: "Php 5,000", status: "Upcoming" },
    { id: "ST-4410", suite: "Family Suite", dates: "Jun 12 - Jun 15, 2026", guests: 4, price: "Php 12,000", status: "Completed" }
];

const mockUsers = [
    { id: "U-0001", phone: "09455296631", name: "Alfredo", address: "Urdaneta City", status: "Upcoming" },
    { id: "U-0002", phone: "09455296632", name: "Maria", address: "Dagupan City", status: "Completed" }
];

function getStatusBadge(status) {
    let colorClass = "";
    if (status === "Upcoming") colorClass = "status-upcoming";
    else if (status === "Active") colorClass = "status-active";
    else if (status === "Completed") colorClass = "status-completed";
    else if (status === "Cancelled") colorClass = "status-cancelled";
    return `<span class="status-badge ${colorClass}">${status}</span>`;
}

function renderData() {
    const carsTable = document.getElementById('cars-table-body');
    carsTable.innerHTML = ''; 
            
    mockCarBookings.forEach(booking => {
        let actionHtml = booking.status === "Upcoming" 
            ? `<a href="#" class="action-link">Modify</a>` 
            : `<a href="#" class="action-link" style="color: #64748b;">View Receipt</a>`;

            carsTable.innerHTML += `
                <tr>
                    <td style="font-weight: 600;">${booking.id}</td>
                    <td>${booking.vehicle}</td>
                    <td>${booking.dates}</td>
                    <td style="font-weight: bold;">${booking.price}</td>
                    <td>${getStatusBadge(booking.status)}</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
        });

    const staysTable = document.getElementById('stays-table-body');
    staysTable.innerHTML = ''; 

    mockStayBookings.forEach(booking => {
        let actionHtml = booking.status === "Upcoming" 
            ? `<a href="#" class="action-link">Modify</a>` 
            : `<a href="#" class="action-link" style="color: #64748b;">View Receipt</a>`;

        staysTable.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${booking.id}</td>
                <td>${booking.suite}</td>
                <td>${booking.dates}</td>
                <td>${booking.guests} Pax</td>
                <td style="font-weight: bold;">${booking.price}</td>
                <td>${getStatusBadge(booking.status)}</td>
            </tr>
        `;
    });

    const usersTable = document.getElementById('users-table-body');
    usersTable.innerHTML = ''; 

    mockUsers.forEach(booking => {
        let actionHtml = booking.status === "Upcoming" 
            ? `<a href="#" class="action-link">Modify</a>` 
            : `<a href="#" class="action-link" style="color: #64748b;">View Receipt</a>`;

        usersTable.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${booking.id}</td>
                <td>${booking.phone}</td>
                <td>${booking.name}</td>
                <td>${booking.address}</td>
                <td>${getStatusBadge(booking.status)}</td>
            </tr>
        `;
    });
}

setTimeout(renderData, 400); // Simulate DB load time