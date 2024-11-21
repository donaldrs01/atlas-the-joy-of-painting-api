CREATE TABLE episodes (
    id SERIAL PRIMARY KEY, -- ID for joining with other tables
    episode_code VARCHAR(10) UNIQUE NOT NULL, -- 'S1E01' string format
    title VARCHAR(255), -- Episode title
    air_date DATE,
    month INT,
    year INT
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY, -- unique ID assigned to each subject
    subject_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE colors (
    id SERIAL PRIMARY KEY, -- unique ID assigned to each color
    color_name VARCHAR(50) UNIQUE NOT NULL,
    hex_value VARCHAR(7) 
);

-- Junction table 
CREATE TABLE episode_subjects (
    episode_id INT REFERENCES episodes(id), -- foreign key references primary key of 'episodes'
    subject_id INT REFERENCES subjects(id),
    PRIMARY KEY (episode_id, subject_id) -- Composite primary key guarantees unique episode/subject pair
);

CREATE TABLE episode_colors (
    episode_id INT REFERENCES episodes(id),
    color_id INT REFERENCES colors(id),
    PRIMARY KEY (episode_id, color_id)
);