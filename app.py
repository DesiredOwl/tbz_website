# app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import close_db

# Import your blueprints!
from auth import auth_bp
from cars import cars_bp
from users import users_bp

app = Flask(__name__)
CORS(app)

# JWT Setup
app.config["JWT_SECRET_KEY"] = "this-is-a-very-long-and-secure-tbz-secret-key-12345"
jwt = JWTManager(app)

# Automatically close the database connection after every request
app.teardown_appcontext(close_db)

# Register the blueprints!
app.register_blueprint(auth_bp)
app.register_blueprint(cars_bp)
app.register_blueprint(users_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)