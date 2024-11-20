import csv

with open('../raw_data/subjects.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)

    header = next(reader)
    subjects = header[2:] # subjects start in 3rd column

    parsed_data = []

    for row in reader:
        episode_id = row[0]
        title = row[1].strip('"')

        for i, value in enumerate(row[2:]):
            if value == "1": # if subject present in episode
                subject = subjects[i] # map to subject name
                parsed_data.append([episode_id, title, subject]) # build list of subjects present
    with open('../parsed_data/parsed_subjects.csv', 'w', newline='', encoding='utf-8') as out_file:
        writer = csv.writer(out_file)
        writer.writerow(["episode_id", "title", "subject"])  # set the header values
        writer.writerows(parsed_data)

print(f"Successfully parsed and printed")