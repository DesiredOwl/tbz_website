# config/db.py
import mysql.connector
from flask import g # 'g' is a special Flask object for sharing data

def get_db():
    """Gets the database connection or creates one if it doesn't exist."""
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Yorkfield2002",
            database="db"
        )
    return g.db

def close_db(e=None):
    """Closes the database connection when the request finishes."""
    db = g.pop('db', None)
    if db is not None:
        db.close()