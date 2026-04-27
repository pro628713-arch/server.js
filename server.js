const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let messages = [];

app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) return res.status(400).json({ error: 'Missing' });
    
    const msg = {
        id: Date.now(),
        username: username,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true });
});

app.get('/messages', (req, res) => {
    res.json({ messages: messages });
});

app.post('/clear', (req, res) => {
    messages = [];
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Running on port ' + PORT);
});
