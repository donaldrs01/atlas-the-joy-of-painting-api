#!/usr/bin/env python3
import csv
from datetime import datetime
import re
import json

with open('../epi_dates.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter='\n') # Override comma delimiter, each line treated as one entry

    parsed_data = []
    for row in reader:
        title = row[0].split(' (')[0].strip('"') # extract title
        air_date = re.search(r'\((.*?)\)', row[0]) # extract air date enclosed in parentheses

        if air_date:
            try:
                air_date_str = air_date.group(1) # Get date string
                parsed_date = datetime.strptime(air_date_str, "%B %d, %Y")
                month = parsed_date.month
                year = parsed_date.year
    
                parsed_data.append({
                    "title": title,
                    "air_date": air_date_str,
                    "month": month,
                    "year": year
                })
            except ValueError as e:
                print(f"Error parsing date '{air_date_str}' for title '{title}': {e}")
                continue
        else:
            print(f"no valid date found for title '{title}'")

# Save parsed data into file
with open('parsed_episodes.json', 'w', encoding='utf-8') as json_file:
    json.dump(parsed_data, json_file, indent=4)
    
