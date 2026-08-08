from flask import Blueprint, jsonify, request
from db import get_db

users_bp = Blueprint('users', __name__)

@users_bp.route('/api/users/car', methods=['GET'])
def get_users_car():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT renter_id, car_id, downpayment, total_payment, driver_mode, destination_from, destination_to, rental_start_date, rental_end_date, total_days, status, receipt_url FROM history_car")
    return jsonify(cursor.fetchall())

@users_bp.route('/api/users/stay', methods=['GET'])
def get_users_stay():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT renter_id, downpayment, total_payment, long_term, rental_start_date, rental_end_date, total_days, status, receipt_url FROM history_stay")
    return jsonify(cursor.fetchall())



@users_bp.route('/api/users/car/<int:booking_id>', methods=['DELETE'])
def cancel_car_booking(booking_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM history_car WHERE renter_id = %s", (booking_id,))
    db.commit()
    return jsonify({"message": "Car booking cancelled successfully"}), 200

@users_bp.route('/api/users/stay/<int:booking_id>', methods=['DELETE'])
def cancel_stay_booking(booking_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM history_stay WHERE renter_id = %s", (booking_id,))
    db.commit()
    return jsonify({"message": "Staycation booking cancelled successfully"}), 200