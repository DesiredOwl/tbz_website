const API_URL = 'http://127.0.0.1:5000/api/cars';

async function loadcars() {
    try{
        const response = await fetch(API_URL);
        const cars = await response.json();

        const container = document.getElementById('car-container');
        container.innerHTML = '';

        cars.forEach(car =>{
            const carDiv = document.createElement('div');
            carDiv.className = 'car-list';

            carDiv.innerHTML = `${car.model} ${car.year} ${car.driver_boolean} Price: Php ${car.rate} / day`;
            container.appendChild(carDiv);
        });
    } catch (e){
        console.error("Error Fetching car list:", e);
    }
}
loadcars();