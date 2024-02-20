// server.js

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Define a route to forward requests to the Google Maps API
app.get('/api/google-maps', async (req, res) => {
  try {
    const { data } = await axios.get('https://maps.googleapis.com' + req.url);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
