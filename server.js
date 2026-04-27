const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let messages = [];

app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) return res.status(400).json({ error: 'Missing' });
    messages.push({ id: Date.now(), username, message, time: new Date().toISOString() });
    if (messages.length > 50) messages.shift();
    res.json({ success: true });
});

app.get('/messages', (req, res) => {
    res.json({ messages });
});

app.post('/clear', (req, res) => {
    messages = [];
    res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log('Running on port ' + PORT));
