const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('id');


const carTitle = document.querySelector('.details-section h1');
const carPrice = document.querySelector('.price-tag');
const specsGrid = document.querySelector('.specs-grid');


if (!carId) {
    window.location.href = 'showroom.html';
} else {
    // If there is an ID, fetch the car data!
    fetchCarDetails(carId);
}

async function fetchCarDetails(id) {
    try {
        carTitle.textContent = "Loading Vehicle...";
        
        const response = await fetch(`http://127.0.0.1:5000/api/cars/${id}`);
        
        if (!response.ok) {
            throw new Error("Car not found in database.");
        }
        
        const car = await response.json();
        
        carTitle.textContent = car.model;
        carPrice.innerHTML = `Php ${car.rate} <span>/ day</span>`;
        
        const transmission = 'Automatic'; 
        const seats = car.model.toLowerCase().includes('veloz') ? '7 Seater' : '5 Seater';
        const driverText = car.driver_boolean ? 'With Driver or Self-Drive' : 'With Driver Only';
        
        specsGrid.innerHTML = `
            <div class="spec-item">⚙️ ${transmission}</div>
            <div class="spec-item">👥 ${seats} Capacity</div>
            <div class="spec-item">⛽ ${car.gas_type || 'Gasoline'} Engine</div>
            <div class="spec-item">🚗 ${driverText}</div>
            <div class="spec-item">📱 Apple CarPlay / Android Auto</div>
            <div class="spec-item">🎵 Bluetooth Audio</div>
        `;
        
        // --- IMAGE GALLERY LOGIC ---
        
        // 1. Group the image columns from the database into an array.
        // .filter(Boolean) removes any null or empty values in case a car only has 2 or 3 images.
        const imageUrls = [
            car.image_1, 
            car.image_2, 
            car.image_3, 
            car.image_4
        ].filter(Boolean); 

        // 2. Target the HTML elements
        const mainImage = document.getElementById('featured-img');
        const thumbnailRow = document.querySelector('.thumbnail-row');

        // 3. Only update the gallery if the database actually returned images
        if (imageUrls.length > 0) {
            
            // Set the big hero image to the first URL in the array
            mainImage.src = imageUrls[0];
            
            // Wipe out the hardcoded HTML thumbnails
            thumbnailRow.innerHTML = '';
            
            // Loop through our array and create new <img> tags
            imageUrls.forEach((url, index) => {
                const img = document.createElement('img');
                img.src = url;
                
                // Make the first thumbnail 'active' by default
                img.className = index === 0 ? 'thumbnail active' : 'thumbnail';
                
                // Attach your existing swapImage function to the click event
                img.onclick = function() { swapImage(this); };
                
                // Inject the new thumbnail into the webpage
                thumbnailRow.appendChild(img);
            });
        } else {
            // Fallback just in case the database has no images for this car
            mainImage.src = "../img/placeholder-car.jpg"; // Create a generic placeholder image
            thumbnailRow.innerHTML = ''; // Hide thumbnails
        }

    } catch (err) {
        console.error("Error fetching car:", err);
        carTitle.textContent = "Vehicle Unavailable";
        carPrice.innerHTML = `---`;
        specsGrid.innerHTML = `<p style="color: #ef4444; grid-column: span 2;">Failed to load vehicle details. Please try again later.</p>`;
    }
}



function swapImage(thumbnailElement) {
            // 1. Get the large image element
    const mainImage = document.getElementById('featured-img');
            
            // 2. Change the large image's source to match the clicked thumbnail
    mainImage.src = thumbnailElement.src;

            // 3. Remove the 'active' blue border from all thumbnails
    const allThumbnails = document.querySelectorAll('.thumbnail');
    allThumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });

            // 4. Add the 'active' blue border to the specific thumbnail we just clicked
    thumbnailElement.classList.add('active');
}

