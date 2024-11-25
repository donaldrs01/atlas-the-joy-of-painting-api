const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Establish DB connection 
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to convert month names into numbers
const monthToNumber = (month) => {
    const months = {
        January: 1, February: 2, March: 3, April: 4, May: 5,
        June: 6, July: 7, August: 8, September: 9, October: 10,
        November: 11, December: 12
    };
    return months[month];
};

// Route to handle filtering or list all episodes
router.get('/', async (req, res) => {
    const { color, subject, month } = req.query;

    if (!color && !subject && !month) {
        // No filters: Return all episodes
        try {
            const query = `
                SELECT id, episode_code, title, air_date, month, year
                FROM episodes
                ORDER BY id ASC;
            `;
            const result = await pool.query(query);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "No episodes found" });
            }

            res.status(200).json(result.rows);
        } catch (err) {
            console.error("Error fetching all episodes:", err.message);
            res.status(500).json({ error: "Unable to fetch episodes" });
        }
    } else if (color) {
        // Filter episodes by color
        try {
            const query = `
                SELECT DISTINCT episodes.id, episodes.episode_code, episodes.title, episodes.air_date, episodes.month, episodes.year
                FROM episodes
                INNER JOIN episode_colors ON episodes.id = episode_colors.episode_id
                INNER JOIN colors ON colors.id = episode_colors.color_id
                WHERE LOWER(colors.color_name) = LOWER($1)
                ORDER BY episodes.id ASC;
            `;
            const values = [color];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: `No episodes found using color "${color}"` });
            }

            res.status(200).json(result.rows);
        } catch (err) {
            console.error(`Error fetching episodes for color "${color}":`, err.message);
            res.status(500).json({ error: "Unable to fetch episodes for the given color" });
        }
    } else if (subject) {
        // Filter episodes by subject
        try {
            const query = `
                SELECT DISTINCT episodes.id, episodes.episode_code, episodes.title, episodes.air_date, episodes.month, episodes.year
                FROM episodes
                INNER JOIN episode_subjects ON episodes.id = episode_subjects.episode_id
                INNER JOIN subjects ON subjects.id = episode_subjects.subject_id
                WHERE LOWER(subjects.subject_name) = LOWER($1)
                ORDER BY episodes.id ASC;
            `;
            const values = [subject];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: `No episodes found with subject "${subject}"` });
            }

            res.status(200).json(result.rows);
        } catch (err) {
            console.error(`Error fetching episodes for subject "${subject}":`, err.message);
            res.status(500).json({ error: "Unable to fetch episodes for the given subject" });
        }
    } else if (month) {
        // Filter episodes by month
        const monthNumber = monthToNumber(month);
        if (!monthNumber) {
            return res.status(400).json({ error: "Invalid month - check your spelling!" });
        }
        try {
            const query = `
                SELECT id, episode_code, title, air_date, month, year
                FROM episodes
                WHERE month = $1
                ORDER BY id ASC
            `;
            const values = [monthNumber];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: `No episodes found for month ${month}` });
            }
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: "Unable to fetch episodes for given month" });
        }
    }
});

module.exports = router;
