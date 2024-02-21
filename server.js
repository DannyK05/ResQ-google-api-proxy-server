const express = require('express');
const axios = require('axios');
const app = express();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// Define your route to proxy requests to the Google Maps API
app.get('/maps/api/place/nearbysearch/json', async (req, res) => {
    try {
        const { location, radius, type, key } = req.query;
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        const response = await axios.get(apiUrl, {
            params: {
                location,
                radius,
                type,
                key
            }
        });

        // Forward the response from the Google Maps API to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Define a route to handle the call to the closest hospital
app.get('/call-closest-hospital', async (req, res) => {
    try {
        const userLocation = req.query.userLocation;
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
                location: userLocation, // Assuming userLocation is in the format 'latitude,longitude'
                radius: 1500,
                type: 'hospital',
                key: 'AIzaSyA-eimkkqp9OSHxHlKuScXbyz9Cr-dgqf0'
            }
        });

        if (response.data.results.length > 0) {
            // Assuming you want to call the closest hospital's number
            const closestHospital = response.data.results[0];
            const placeId = closestHospital.place_id;

            // Now, you need to get the details of the closest hospital using the place_id
            const detailsResponse = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    place_id: placeId,
                    key: 'AIzaSyA-eimkkqp9OSHxHlKuScXbyz9Cr-dgqf0'
                }
            });

            const hospitalNumber = detailsResponse.data.result.formatted_phone_number;
            res.json({ hospitalNumber });
        } else {
            res.status(404).json({ error: "No hospitals found nearby" });
        }
    } catch (error) {
        console.error('Error calling the closest hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// for the map feature of ResQ
    app.get('/fetch-nearby-hospitals', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // Make API request to fetch nearby hospitals
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: 1500,
                type: 'hospital',
                key: 'AIzaSyA-eimkkqp9OSHxHlKuScXbyz9Cr-dgqf0'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching nearby hospitals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
