import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DB_SETTINGS = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

def populate_subjects_from_csv(csv_file):
    try:
        conn = psycopg2.connect(**DB_SETTINGS)
        cur = conn.cursor()

        with open(csv_file, 'r') as file:
            headers = file.readline().strip().split(',')
            subjects = headers[2:]  # skip 'episode' and 'title' columns

            for subject in subjects:
                sql = """
                INSERT INTO subjects (subject_name)
                VALUES (%s)
                ON CONFLICT (subject_name) DO NOTHING;
                """
                cur.execute(sql, (subject,))

        conn.commit()
        print("Subjects table populated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

populate_subjects_from_csv('../../raw_data/raw_subjects.csv')
