import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Establish DB connection
DB_SETTINGS = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}

# Test DB connection
try:
    conn = psycopg2.connect(**DB_SETTINGS)
    print("Database connection successful")
    conn.close()
except Exception as e:
    print(f"Error: unable to connect to the DB. \n{e}")