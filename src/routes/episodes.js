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
    const { month } = req.query;
    // Validate month
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid month entry. Provide value between 1-12.' });
    }

    try {
        // DB query for episodes of specfiic month
        // $1 placeholder
        const query = 'SELECT * FROM episodes WHERE month = $1';
        // Substitute 'month' value into query
        const values = [month];
        // Execute query
        const result = await pool.query(query, values);
        // Provide result
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch episodes by month' });
    }
});

module.exports = router;