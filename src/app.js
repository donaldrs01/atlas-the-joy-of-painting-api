require('dotenv').config();

const express = require('express');
const episodesRoutes = require('./routes/episodes');
const subjectsRoutes = require('./routes/subjects');
const colorsRoutes = require('./routes/colors');

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to The Joy of Building an API');
});

// Route mounting

// Primary endpoint for episode filtering
// /episodes lists all episodes
// /episodes?month={} filters by month
// /episode?color={} filters by color
// /episode?subject={} filters by subject
app.use('/episodes', episodesRoutes);

// Lists all subjects and corresponding IDs
app.use('/subjects', subjectsRoutes);

// Lists all colors (in alphabetical order) and corresponding IDs
app.use('/colors', colorsRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


