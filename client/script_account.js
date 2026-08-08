// --- 1. DROPDOWN MENU LOGIC ---
const avatarBtn = document.getElementById('avatar-btn');
const userDropdown = document.getElementById('user-dropdown');

// --- 0. LOAD USER DATA ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    const firstName = localStorage.getItem('user_first_name');
    const lastName = localStorage.getItem('user_last_name');
    const email = localStorage.getItem('user_email');

    // Security Check: If no user is logged in, kick them back to the login page!
    if (!firstName || !email) {
        window.location.href = 'login.html';
        return;
    }

    // Update the HTML text with the logged-in user's data
    document.getElementById('display-name-header').textContent = firstName;
    document.getElementById('display-name-dropdown').textContent = `${firstName} ${lastName}`;
    document.getElementById('display-email-dropdown').textContent = email;

    // Bonus: Update the Avatar button to show the first letter of their name!
    avatarBtn.textContent = firstName.charAt(0).toUpperCase();
});

// --- LOGOUT LOGIC ---
function logoutUser() {
    localStorage.clear(); // Wipes all saved user data and tokens
    window.location.href = 'login.html';
}





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

function getStatusBadge(status) {
    let colorClass = "";
    if (status === "Upcoming") colorClass = "status-upcoming";
    else if (status === "Ongoing") colorClass = "status-active";
    else if (status === "Completed") colorClass = "status-completed";
    else if (status === "Cancelled") colorClass = "status-cancelled";
    return `<span class="status-badge ${colorClass}">${status}</span>`;
}


// --- MODAL LOGIC (CANCEL & VIEW RECEIPT) ---
const modalOverlay = document.getElementById('user-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(action, bookingId, bookingType, receiptUrl = null) {
    if (action === 'cancel') {
        modalTitle.textContent = "Cancel Booking";
        modalBody.innerHTML = `
            <p style="color: #ef4444; font-weight: bold; margin-top: 0;">Are you sure you want to cancel this booking?</p>
            <p style="color: #64748b; margin-bottom: 20px;">This action cannot be undone and your reservation will be permanently removed.</p>
            <button style="background: #ef4444; width: 100%; padding: 12px; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;" onclick="cancelBooking(${bookingId}, '${bookingType}')">Yes, Cancel Booking</button>
        `;
    } else if (action === 'receipt') {
        modalTitle.textContent = "View Receipt";
        // If the admin hasn't uploaded a URL yet, show a placeholder
        const imgSource = receiptUrl ? receiptUrl : 'https://via.placeholder.com/400x300?text=No+Receipt+Uploaded+Yet';
        
        modalBody.innerHTML = `
            <p style="color: #64748b; margin-bottom: 20px; margin-top: 0;">Here is the receipt for your transaction.</p>
            <img src="${imgSource}" alt="Receipt" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc;">
            <button style="background: #2563eb; width: 100%; padding: 12px; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold; margin-top: 15px;" onclick="closeModal()">Close</button>
        `;
    }

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}


// Function to trigger the Python DELETE API
async function cancelBooking(bookingId, type) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/users/${type}/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            closeModal();
            loadCars(); // Refresh the tables to remove the cancelled booking
        } else {
            alert("Failed to cancel booking. Please try again.");
        }
    } catch (err) {
        console.error("Deletion error:", err);
        alert("Could not connect to the server.");
    }
}


async function loadCars() {
    const carsTable = document.getElementById('cars-table-body');
    const staysTable = document.getElementById('stays-table-body');

    try {
        
        const response_car = await fetch('http://127.0.0.1:5000/api/users/car');
        const cars = await response_car.json();

        carsTable.innerHTML = '';

        if (cars.length === 0) {
            carsTable.innerHTML = '<p style="text-align: center; width: 100%; color: #64748b;">You dont have any car rental history.</p>';
            return;
        }

        cars.forEach(booking =>{
            // Determine the action link based on status
            // Pass the booking.id to the openModal function!
            let actionHtml = booking.status === "Upcoming" 
                ? `<button onclick="openModal('cancel', ${booking.renter_id}, 'car')" style="color: #ef4444; background: none; border: none; cursor: pointer; font-weight: bold;">Cancel</button>` 
                : `<button onclick="openModal('receipt', ${booking.renter_id}, 'car', '${booking.receipt_url || ''}')" style="color: #2563eb; background: none; border: none; cursor: pointer; font-weight: bold;">View Receipt</button>`;
                
            const driverText = booking.driver_mode ? 'With Driver' : 'Self-Drive';
            carsTable.innerHTML += `
                <tr>
                    <td style="font-weight: 600;">${booking.car_id}</td>
                    <td style="font-weight: bold;">Php ${booking.downpayment}</td>
                    <td style="font-weight: bold;">Php ${booking.total_payment}</td>
                    <td>${driverText}</td>
                    <td>${booking.destination_from}</td>
                    <td>${booking.destination_to}</td>
                    <td>${booking.rental_start_date}</td>
                    <td>${booking.rental_end_date}</td>
                    <td>${booking.total_days}</td>
                    <td>${getStatusBadge(booking.status)}</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
        });
   


        const response_stay = await fetch('http://127.0.0.1:5000/api/users/stay');
        const stay = await response_stay.json();
        staysTable.innerHTML = '';

        if (stay.length === 0) {
            staysTable.innerHTML = '<p style="text-align: center; width: 100%; color: #64748b;">You dont have any staycation rental history.</p>';
            return;
        }

        stay.forEach(booking => {
            const TermText = booking.long_term ? 'Long Term' : 'Short Term';
            let actionHtml = booking.status === "Upcoming" 
                ? `<button onclick="openModal('cancel', ${booking.renter_id}, 'stay')" style="color: #ef4444; background: none; border: none; cursor: pointer; font-weight: bold;">Cancel</button>` 
                : `<button onclick="openModal('receipt', ${booking.renter_id}, 'stay', '${booking.receipt_url || ''}')" style="color: #2563eb; background: none; border: none; cursor: pointer; font-weight: bold;">View Receipt</button>`;

        staysTable.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${booking.renter_id}</td>
                <td style="font-weight: bold;">Php ${booking.downpayment}</td>
                <td style="font-weight: bold;">Php ${booking.total_payment}</td>
                <td>${TermText}</td>
                <td>${booking.rental_start_date}</td>
                <td>${booking.rental_end_date}</td>
                <td>${booking.total_days}</td>
                <td>${getStatusBadge(booking.status)}</td>
                <td>${actionHtml}</td>
            </tr>
        `;
    });



    } catch (error) {
        console.error("Error fetching cars:", err);
    }


}
setTimeout(loadCars, 400); // Simulate DB load time