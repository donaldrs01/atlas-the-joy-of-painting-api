const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Establish DB connection 
const pool = new Pool ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// If no color provided, list all colors
// Otherwise, list all episodes with given color
router.get('/', async (req, res) => {
    const { color } = req.query;

    // If no name provided, return all colors
    if (!color) {
        try {
            const query = `
                SELECT id AS color_id, color_name, hex_value
                FROM colors
                ORDER BY color_name ASC;
            `;
            const result = await pool.query(query);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "No colors found" });
            }
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: "Unable to fetch colors" });
        }
    } else {
        // If color provided, filter episodes based on color name
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
                return res.status(404).json({ error: `No episodes found using "${color}"` });
            }

            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: "Unable to fetch episodes for given color" });
        }
    }
});
  

        

module.exports = router;