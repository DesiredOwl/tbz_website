async function loadCars() {
    const container = document.getElementById('car-container');
            
    try {
        // Fetch cars from Flask backend
        const response = await fetch('http://127.0.0.1:5000/api/cars');
        const cars = await response.json();
                
        container.innerHTML = '';

        if (cars.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%; color: #64748b;">No cars are currently available.</p>';
            return;
        }

        // Loop through the database results and create a card for each car
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';

            // We use dummy data for things not in your DB yet (like seats/transmission)
            const transmission = 'Automatic'; 
            const seats = car.model.toLowerCase().includes('veloz') ? '7-Seater' : '5-Seater';
                    
            const imageUrl = car.image_1;

            carCard.innerHTML = `
                <img src="${imageUrl}" alt="${car.model}" class="car-image">
                <div class="car-info">
                    <h3>${car.model} <span style="font-size: 1rem; color: #64748b; font-weight: normal;">(${car.year})</span></h3>
                            
                    <div class="specs">
                        <span class="spec-badge">${transmission}</span>
                        <span class="spec-badge">${seats}</span>
                        <span class="spec-badge">${car.gas_type || 'Gasoline'}</span>
                    </div>
                            
                    <div class="card-footer">
                        <p class="price">Php ${car.rate} <span>/ day</span></p>
                        <a href="car.html?id=${car.id}" class="book-now-btn" style="text-align: center; text-decoration: none; display: block; box-sizing: border-box;">Book Now</a>
                     </div>
                </div>
            `;
            container.appendChild(carCard);
        });
    } catch (err) {
        console.error("Error fetching cars:", err);
        container.innerHTML = '<p style="text-align: center; color: #ef4444; width: 100%;">Failed to load vehicles. Make sure your Python backend is running!</p>';
    }
}

loadCars();