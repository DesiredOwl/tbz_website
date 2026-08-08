document.getElementById('add-car-form').addEventListener('submit', async function(e) {
            e.preventDefault(); 
            const newCar = {
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                plate_number: document.getElementById('plate_number').value,
                gas_type: document.getElementById('gas_type').value,
                driver_boolean: document.getElementById('driver_boolean').value,
                rate: document.getElementById('rate').value
            };
            try {
                const response = await fetch('http://127.0.0.1:5000/api/cars', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCar)
                });
                if (response.ok){
                    document.getElementById('status_text').innerText = "Car Successfully Added!";
                    document.getElementById('add-car-form').reset();
                }else{
                    document.getElementById('status_text').innerText = "Error Adding Car.";
                }
            } catch (error) {
                console.error("Error:",error);
                document.getElementById('status_text').innerText = "Failed to connect to server.";
            }
});
