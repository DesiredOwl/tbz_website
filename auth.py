# routes/auth.py
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from db import get_db

# 1. Create the Blueprint
auth_bp = Blueprint('auth', __name__)

# 2. Attach routes to the blueprint (Notice we use @auth_bp.route now!)
@auth_bp.route('/api/register', methods=['POST'])
def register():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.json
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    if cursor.fetchone():
        return jsonify({"error": "Email already in use!"}), 400

    hashed_password = generate_password_hash(data['password'])
    
    sql = "INSERT INTO users (email, password_hash, first_name, last_name, phone, city) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (data['email'], hashed_password, data['first_name'], data['last_name'], data['phone'], data['city']))
    db.commit()

    return jsonify({"message": "Account created!"}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    data = request.json

    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()

    if user and check_password_hash(user['password_hash'], data['password']):
        access_token = create_access_token(identity=user['id'])
        return jsonify({"access_token": access_token, "message": "Logged in!", "user":{"first_name": user['first_name'], "last_name": user['last_name'],"email": user['email']} }), 200
        
    return jsonify({"error": "Invalid credentials"}), 401