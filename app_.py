from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Yorkfield2002",
    database="db"
)

@app.route('/api/cars', methods=['GET'])
def get_cars():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT model, year, plate_number, gas_type, driver_boolean, rate, is_available FROM cars WHERE is_available = TRUE")
    available_cars = cursor.fetchall()
    return jsonify(available_cars)

@app.route('/api/cars', methods=['POST'])
def add_car():
    new_car = request.json
    cursor = db.cursor()
    sql = """
        INSERT INTO cars (model, year, driver_boolean, rate, gas_type, plate_number, is_available)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
    values = (
        new_car['model'],
        new_car['year'],
        new_car['driver_boolean'],
        new_car['rate'],
        new_car['gas_type'],
        new_car['plate_number'],
        True
    )

    cursor.execute(sql, values)
    db.commit()

    return jsonify({"message": "Car Successfully Added!"}), 201
if __name__ == '__main__':
    app.run(debug=True, port=5000)
