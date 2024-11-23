require('dotenv').config();

const express = require('express');
const episodesRoutes = require('./routes/episodes');
const subjectsRoutes = require('./routes/subjects');

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to The Joy of Building an API');
});

// Route mounting
app.use('/episodes', episodesRoutes);
app.use('/subjects', subjectsRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


