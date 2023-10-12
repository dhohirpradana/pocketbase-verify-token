require('dotenv').config();

const express = require('express');
const PocketBase = require('pocketbase/cjs')

const app = express();
const port = 3000;

const pocketBaseUrl = process.env.POCKETBASE_URL;
if (!pocketBaseUrl) {
    console.error('Missing POCKETBASE_URL environment variable.');
    process.exit(1); // Exit the application
}
const pb = new PocketBase(pocketBaseUrl);

app.use(express.json());

// Middleware to check for authorization headers
const requireAuthorization = (req, res, next) => {
    const authToken = req.header('Authorization');
    if (!authToken) {
        return res.status(401).json({ message: 'Missing Authorization header.' });
    }
    pb.authStore.save(authToken, null); // Set the authentication token for PocketBase
    next();
};

// API endpoint that requires authorization
app.get('/verify-token', requireAuthorization, async (req, res) => {
    try {
        const authData = await pb.collection('users').authRefresh();
        res.json({...authData['record']});
    } catch (error) {
        res.status(401).json({ error: error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
