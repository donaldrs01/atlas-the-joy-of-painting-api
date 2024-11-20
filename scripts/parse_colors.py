import csv

with open('../raw_data/colors.csv', 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    parsed_data = []

    for row in reader:
        # generate episode code using season and episode values
        season = int(row['season'])
        episode = int(row['episode'])
        full_epi_code = f"S{season:02d}E{episode:02d}"

        # parse colors and corresponding hex value
        colors = eval(row['colors'])
        hex_values = eval(row['color_hex'])

        # append color to its hex value
        for color, hex_value in zip(colors, hex_values):
            parsed_data.append([full_epi_code, color.strip(), hex_value.strip()])

# Generate CSV with normalized data
with open('../parsed_data/parsed_colors.csv', 'w', newline='', encoding='utf-8') as out_file:
    writer = csv.writer(out_file)
    writer.writerow(['full_epi_code', 'color', 'hex_value']) # header
    writer.writerows(parsed_data)

print("Data successfully normalized and written to CSV file")