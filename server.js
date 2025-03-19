import express from 'express'; // Use import for express
import cors from 'cors'; // Use import for cors
import fetch from 'node-fetch'; // Use import for node-fetch

const app = express();
const port = 3000;

// Enable CORS for all requests
app.use(cors());

// Endpoint to fetch game release data
app.get('/api/game-releases', async (req, res) => {
    const clientId = 'mv9526izokxlgxqh83gusppt7yfn6z';
    const accessToken = 'okxajnuv4m071nlh5n5hbhd8j00737'; // Ensure this is the correct Access Token
    const apiUrl = 'https://api.igdb.com/v4/release_dates';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`, // Ensure the format is correct
                'Content-Type': 'application/json'
            },
            body: `fields game.name, date, platform.name; where date > ${Math.floor(Date.now() / 1000)}; sort date asc; limit 10;`
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching game releases:', error.message);
        res.status(500).json({ error: 'Error fetching game releases', details: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});