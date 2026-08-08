CREATE TABLE cars(
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    year VARCHAR(50),
    plate_number VARCHAR(10),
    gas_type VARCHAR(10),
    driver_boolean BOOLEAN,
    rate DECIMAL(6,2),
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE renter_info(
    id INT AUTO_INCREMENT PRIMARY KEY,
    renter_name VARCHAR(50),
    renter_address VARCHAR(50),
    renter_phone VARCHAR(20),
    renter_dl
);

CREATE TABLE history(
    renter_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT,
    downpayment INT,
    total_payment INT,
    driver_mode BOOLEAN,
    destination_from VARCHAR(50),
    destination_to VARCHAR(50),
    rental_start_date DATE,
    rental_end_date DATE,
    rental_start_time TIME,
    total_days INT,
    signed_contract
);

INSERT INTO cars(model, year, plate_number, gas_type, driver_boolean, rate) 
VALUES
('Toyota Wigo G', '2016', 'IDI 1769', 'Unleaded', 1, '1800'), 
('Toyota Vios XLE', '2024', 'NKB 9467', 'Unleaded', 1, '2400'),
('Toyota Veloz V', '2024', 'IAF 1496', 'Unleaded', 0, '3200');