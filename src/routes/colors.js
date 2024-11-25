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

router.get('/', async (req, res) => {
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
});

router.get('/:id/episodes', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid colorID. Must be a number.' });
    }

    try {
        const query = `
            SELECT DISTINCT episodes.id, episodes.episode_code, episodes.title, episodes.air_date, episodes.month, episodes.year
            FROM episodes
            INNER JOIN episode_colors ON episodes.id = episode_colors.episode_id
            WHERE episode_colors.color_id = $1
            ORDER BY episodes.id ASC;
        `;
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No episodes found using color id ${id}`});
        }

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch episodes for given color" });
    }
});

module.exports = router;