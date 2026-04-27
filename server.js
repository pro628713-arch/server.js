const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let messages = [];
let mutedPlayers = {};
let chatEnabled = true;
let creators = ["adam_saadi8737", "go2mohamed"];

function isCreator(username) {
    return creators.includes(username);
}

function isMuted(username) {
    if (mutedPlayers[username]) {
        if (Date.now() < mutedPlayers[username]) {
            return true;
        }
        delete mutedPlayers[username];
        return false;
    }
    return false;
}

// Send message
app.post('/send', (req, res) => {
    const { username, message } = req.body;
    
    if (!username || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    
    if (!chatEnabled && !isCreator(username)) {
        return res.json({ error: 'Chat is disabled', success: false });
    }
    
    if (isMuted(username)) {
        return res.json({ error: 'You are muted', success: false });
    }
    
    const msg = {
        id: Date.now(),
        username: username,
        message: message,
        isCreator: isCreator(username),
        timestamp: new Date().toISOString()
    };
    
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true, message: msg });
});

// Get messages
app.get('/messages', (req, res) => {
    res.json({ 
        messages: messages,
        chatEnabled: chatEnabled,
        mutedPlayers: Object.keys(mutedPlayers).filter(name => isMuted(name))
    });
});

// Admin: Mute
app.post('/admin/mute', (req, res) => {
    const { adminName, targetName, duration } = req.body;
    
    if (!isCreator(adminName)) {
        return res.status(403).json({ error: 'Not creator' });
    }
    
    mutedPlayers[targetName] = Date.now() + (duration * 1000);
    
    const msg = {
        id: Date.now(),
        username: 'System',
        message: `🔇 ${targetName} muted for ${duration}s by ${adminName}`,
        isCreator: false,
        timestamp: new Date().toISOString()
    };
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true });
});

// Admin: Unmute
app.post('/admin/unmute', (req, res) => {
    const { adminName, targetName } = req.body;
    
    if (!isCreator(adminName)) {
        return res.status(403).json({ error: 'Not creator' });
    }
    
    delete mutedPlayers[targetName];
    
    const msg = {
        id: Date.now(),
        username: 'System',
        message: `🔊 ${targetName} unmuted by ${adminName}`,
        isCreator: false,
        timestamp: new Date().toISOString()
    };
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true });
});

// Admin: Toggle Chat
app.post('/admin/togglechat', (req, res) => {
    const { adminName } = req.body;
    
    if (!isCreator(adminName)) {
        return res.status(403).json({ error: 'Not creator' });
    }
    
    chatEnabled = !chatEnabled;
    
    const msg = {
        id: Date.now(),
        username: 'System',
        message: chatEnabled ? '💬 Chat enabled!' : '🚫 Chat disabled!',
        isCreator: false,
        timestamp: new Date().toISOString()
    };
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true, chatEnabled: chatEnabled });
});

// Admin: Clear
app.post('/admin/clear', (req, res) => {
    const { adminName } = req.body;
    
    if (!isCreator(adminName)) {
        return res.status(403).json({ error: 'Not creator' });
    }
    
    messages = [];
    
    const msg = {
        id: Date.now(),
        username: 'System',
        message: '🗑️ Chat cleared by ' + adminName,
        isCreator: false,
        timestamp: new Date().toISOString()
    };
    messages.push(msg);
    
    res.json({ success: true });
});

// Admin Status
app.get('/admin/status', (req, res) => {
    res.json({
        chatEnabled: chatEnabled,
        mutedPlayers: Object.keys(mutedPlayers).filter(name => isMuted(name)),
        creators: creators
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('API running on port ' + PORT);
});
    
