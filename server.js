const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Default route goes to login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Dashboard server running on http://localhost:${PORT}`);
});