const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// قائمة الأدمن
const admins = ["adam_saadi8737", "go2mohamed"];

let messages = [];

app.post('/send', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) return res.status(400).json({ error: 'Missing' });

    const isAdmin = admins.includes(username);

    messages.push({
        id: Date.now(),
        username,
        message,
        isAdmin
    });

    if (messages.length > 50) messages.shift();

    res.json({ success: true });
});

app.get('/messages', (req, res) => {
    res.json({ messages });
});

app.listen(3000, () => console.log('Running!'));
