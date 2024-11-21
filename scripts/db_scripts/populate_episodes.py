import csv
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

def populate_episodes(csv_file):
    try:
        conn = psycopg2.connect(**DB_SETTINGS)
        cur = conn.cursor()

        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)

            for row in reader:
                sql = """
                INSERT INTO episodes (id, title, air_date, month, year, episode_code)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (episode_code) DO NOTHING;
                """
                cur.execute(sql, (
                    row['id'],
                    row['title'],
                    row['air_date'],
                    row['month'],
                    row['year'],
                    row['full_epi_code']
                ))

        conn.commit()
        print("Episodes table populated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

populate_episodes('../../parsed_data/episodes.csv')
