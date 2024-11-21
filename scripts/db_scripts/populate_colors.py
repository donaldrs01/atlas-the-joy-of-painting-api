import pandas as pd
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

def populate_colors_and_episode_colors(csv_file):
    try:
        # Load the CSV file
        df = pd.read_csv(csv_file)

        # Connect to the database
        conn = psycopg2.connect(**DB_SETTINGS)
        cur = conn.cursor()

        # Insert unique colors into the `colors` table
        unique_colors = df[['color', 'hex_value']].drop_duplicates()
        for _, row in unique_colors.iterrows():
            sql = """
            INSERT INTO colors (color_name, hex_value)
            VALUES (%s, %s)
            ON CONFLICT (color_name) DO NOTHING;
            """
            cur.execute(sql, (row['color'], row['hex_value']))

        # Insert data into `episode_colors` table
        for _, row in df.iterrows():
            sql = """
            INSERT INTO episode_colors (episode_id, color_id)
            VALUES (
                (SELECT id FROM episodes WHERE episode_code = %s),
                (SELECT id FROM colors WHERE color_name = %s)
            )
            ON CONFLICT (episode_id, color_id) DO NOTHING;
            """
            cur.execute(sql, (row['full_epi_code'], row['color']))

        conn.commit()
        print("Colors and episode_colors tables populated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cur.close()
        conn.close()

# Call the function with the path to your parsed CSV file
populate_colors_and_episode_colors('../../parsed_data/colors.csv')
