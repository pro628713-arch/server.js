const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let messages = [];

app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) return res.status(400).json({ error: 'Missing' });
    messages.push({ id: Date.now(), username, message });
    if (messages.length > 50) messages.shift();
    res.json({ success: true });
});

app.get('/messages', (req, res) => {
    res.json({ messages });
});

app.listen(3000, () => console.log('Running!'));
