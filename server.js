const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Define your route to proxy requests to the Google Maps API
app.get('/maps/api/place/nearbysearch/json', async (req, res) => {
    try {
        const { location, radius, type } = req.query;
        const apiKey = req.query.key; // Retrieve API key from request parameters
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        const response = await axios.get(apiUrl, {
            params: {
                location,
                radius,
                type,
                key: apiKey // Include API key in the request to Google Maps API
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
 // This listens on all available network interfaces

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

