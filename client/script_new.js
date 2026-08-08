const avatarBtn = document.getElementById('avatar-btn');
const userDropdown = document.getElementById('user-dropdown');

avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        userDropdown.classList.remove('show');
    }
});

function switchTab(tabId, btnElement) {
    // Hide all contents
     document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                
    // Show selected tab and highlight button
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}

const modalOverlay = document.getElementById('admin-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(title, type = 'default') {
    modalTitle.textContent = title;
                
        // Inject different forms based on what button was clicked
        if(type === 'edit') {
        modalBody.innerHTML = `
            <label>Update Status</label>
            <select>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
            </select>
            <label>Reschedule Dates</label>
            <input type="text" value="Aug 15 - Aug 18, 2026">
            <button class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 10px;" onclick="closeModal()">Save Changes</button>
        `;
    } else if(type === 'receipt') {
        modalBody.innerHTML = `
            <p style="color: #64748b; margin-bottom: 20px;">Upload proof of payment or ID.</p>
            <input type="file">
            <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="closeModal()">Upload File</button>
        `;
    } else if (type === 'delete') {
        modalBody.innerHTML = `
            <p style="color: #ef4444; font-weight: bold;">Are you sure you want to delete this record?</p>
            <p style="color: #64748b; margin-bottom: 20px;">This action cannot be undone.</p>
            <button class="btn btn-primary" style="background: #ef4444;" onclick="closeModal()">Yes, Delete</button>
            `;
    } else {
        // Default generic form
        modalBody.innerHTML = `<p>Loading form...</p>`;
    }

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

// Global action functions
function exportData() {
    // In the future, this will use SheetJS to convert JSON to CSV
    alert("Data prepared for Export. (Will download .csv when backend is connected)");
}

const mockCars = [
    { id: "CR-9012", user: "Juan Dela Cruz", vehicle: "Toyota Veloz", dates: "Aug 15 - Aug 18", status: "Upcoming" },
    { id: "CR-8842", user: "Maria Santos", vehicle: "Toyota Vios", dates: "Jul 01 - Jul 03", status: "Completed" }
];

const mockStays = [
    { id: "ST-5021", user: "Pedro Penduko", suite: "Executive Suite", dates: "Sep 01 - Sep 03", status: "Upcoming" }
];

const mockUsers = [
    { id: "USR-001", name: "Juan Dela Cruz", email: "juan@example.com", phone: "09123456789" },
    { id: "USR-002", name: "Maria Santos", email: "maria@example.com", phone: "09987654321" }
];

function getStatusBadge(status) {
    let cls = status === "Upcoming" ? "status-upcoming" : status === "Completed" ? "status-completed" : "status-cancelled";
    return `<span class="status-badge ${cls}">${status}</span>`;
}

function renderAdminData() {
    const carsTable = document.getElementById('cars-table-body');
    carsTable.innerHTML = mockCars.map(b => `
        <tr>
            <td style="font-weight: bold;">${b.id}</td>
            <td>${b.user}</td>
            <td>${b.vehicle}</td>
            <td>${b.dates}</td>
            <td>${getStatusBadge(b.status)}</td>
            <td style="text-align: right;">
                <button class="action-btn receipt" title="Upload Receipt" onclick="openModal('Receipt for ${b.id}', 'receipt')"><i class="fas fa-file-invoice"></i></button>
                <button class="action-btn edit" title="Edit Booking" onclick="openModal('Edit Booking ${b.id}', 'edit')"><i class="fas fa-pencil-alt"></i></button>
                <button class="action-btn delete" title="Cancel Booking" onclick="openModal('Delete Booking', 'delete')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    const staysTable = document.getElementById('stays-table-body');
    staysTable.innerHTML = mockStays.map(b => `
        <tr>
            <td style="font-weight: bold;">${b.id}</td>
            <td>${b.user}</td>
            <td>${b.suite}</td>
            <td>${b.dates}</td>
            <td>${getStatusBadge(b.status)}</td>
            <td style="text-align: right;">
                <button class="action-btn receipt" title="Upload Receipt" onclick="openModal('Receipt for ${b.id}', 'receipt')"><i class="fas fa-file-invoice"></i></button>
                <button class="action-btn edit" title="Edit Booking" onclick="openModal('Edit Booking ${b.id}', 'edit')"><i class="fas fa-pencil-alt"></i></button>
                <button class="action-btn delete" title="Cancel Booking" onclick="openModal('Delete Booking', 'delete')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    const usersTable = document.getElementById('users-table-body');
    usersTable.innerHTML = mockUsers.map(u => `
        <tr>
            <td style="font-weight: bold; color: #64748b;">${u.id}</td>
            <td style="font-weight: bold;">${u.name}</td>
            <td>${u.email}</td>
            <td>${u.phone}</td>
            <td style="text-align: right;">
                <button class="action-btn edit" title="Edit User" onclick="openModal('Edit User: ${u.name}', 'edit')"><i class="fas fa-user-edit"></i></button>
                <button class="action-btn delete" title="Delete User" onclick="openModal('Delete User', 'delete')"><i class="fas fa-user-times"></i></button>
            </td>
        </tr>
    `).join('');
}

// Initial render
setTimeout(renderAdminData, 300);