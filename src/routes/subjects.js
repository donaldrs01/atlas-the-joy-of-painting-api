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

// Route to fetch all subjects
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM subjects ORDER BY subject_name ASC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

// Route to fetch all episodes for a specific subject
router.get('/:id/episodes', async (req, res) => {
    const id = req.params.id;

    try {
        const query = `
        SELECT episodes.id, episodes.title, episodes.air_date
        FROM episodes
        INNER JOIN episode_subjects ON episode_id = episode_subjects.episode_id
        WHERE episode_subjects.subject_id = $1
    `;
    // value in array replaces $1 at runtime (subject.id)
    const values = [id];
    // Execute query
    const result = await pool.query(query, values);
    // No matching episode in DB storage
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No matching episodes for given subject" });
    }
    res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to fetch episodes for given subject" });
    }
});


module.exports = router;