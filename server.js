const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// تخزين الرسايل + المكتومين + حالة الشات
let messages = [];
let mutedPlayers = {}; // { username: expiryTime }
let chatEnabled = true;
let creators = ["adam_saadi8737", "go2mohamed"]; // اسماء الـ Creators

// ========== HELPERS ==========
function isCreator(username) {
    return creators.includes(username);
}

function isMuted(username) {
    if (mutedPlayers[username]) {
        if (Date.now() < mutedPlayers[username]) {
            return true;
        } else {
            delete mutedPlayers[username];
            return false;
        }
    }
    return false;
}

// ========== CHAT ENDPOINTS ==========

// إرسال رسالة
app.post('/send', (req, res) => {
    const { username, message } = req.body;
    
    if (!username || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    
    // لو الشات مقفول وما هو creator
    if (!chatEnabled && !isCreator(username)) {
        return res.json({ error: 'Chat is disabled', success: false });
    }
    
    // لو مكتوم
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

// جلب الرسايل
app.get('/messages', (req, res) => {
    res.json({ 
        messages: messages,
        chatEnabled: chatEnabled,
        mutedPlayers: Object.keys(mutedPlayers).filter(name => isMuted(name))
    });
});

// ========== ADMIN ENDPOINTS ==========

// كتم لاعب
app.post('/admin/mute', (req, res) => {
    const { adminName, targetName, duration } = req.body;
    
    if (!isCreator(adminName)) {
        return res.status(403).json({ error: 'Not creator' });
    }
    
    if (!targetName || !duration) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    
    mutedPlayers[targetName] = Date.now() + (duration * 1000);
    
    // نضيف رسالة نظام
    const msg = {
        id: Date.now(),
        username: 'System',
        message: `🔇 ${targetName} muted for ${duration}s by ${adminName}`,
        isCreator: false,
        timestamp: new Date().toISOString()
    };
    messages.push(msg);
    if (messages.length > 50) messages.shift();
    
    res.json({ success: true, muted: targetName, duration: duration });
});

// فك كتم
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
    
    res.json({ success: true, unmuted: targetName });
});

// تفعيل/تعطيل الشات
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

// مسح الشات
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

// جلب حالة الـ Admin (للـ check)
app.get('/admin/status', (req, res) => {
    res.json({
        chatEnabled: chatEnabled,
        mutedPlayers: Object.keys(mutedPlayers).filter(name => isMuted(name)),
        creators: creators
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Creator Chat API running on port ${PORT}`);
});
