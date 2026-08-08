# routes/cars.py
from flask import Blueprint, jsonify, request
from db import get_db

# Create the Cars blueprint
cars_bp = Blueprint('cars', __name__)

@cars_bp.route('/api/cars', methods=['GET'])
def get_cars():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, model, year, plate_number, gas_type, driver_boolean, rate, is_available, image_1 FROM cars WHERE is_available = TRUE")
    return jsonify(cursor.fetchall())

@cars_bp.route('/api/cars/<int:car_id>', methods=['GET'])
def get_single_car(car_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cars WHERE id = %s", (car_id,))
    car = cursor.fetchone()
    if car:
        return jsonify(car)
    return jsonify({"error": "Car not found"}), 404