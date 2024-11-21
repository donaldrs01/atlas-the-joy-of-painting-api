import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Database connection settings
DB_SETTINGS = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

def populate_episode_subjects(csv_file):
    try:
        # Load the CSV file
        df = pd.read_csv(csv_file)

        # Connect to the database
        conn = psycopg2.connect(**DB_SETTINGS)
        cur = conn.cursor()

        # Insert data into `episode_subjects` table
        for _, row in df.iterrows():
            # Matching episode ID  (!,2,3) with episode_code (S01E01, S01E02, etc)
            # Matching subject ID (1,2,3) with subject name 
            sql = """
            INSERT INTO episode_subjects (episode_id, subject_id)
            VALUES (
                (SELECT id FROM episodes WHERE episode_code = %s),
                (SELECT id FROM subjects WHERE subject_name = %s)
            )
            ON CONFLICT (episode_id, subject_id) DO NOTHING;
            """
            cur.execute(sql, (row['episode_id'], row['subject']))

        conn.commit()
        print("Episode_subjects table populated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

# Call the function with the path to your subjects.csv file
populate_episode_subjects('../../parsed_data/subjects.csv')
