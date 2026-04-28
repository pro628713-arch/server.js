const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// تخزين مؤقت (RAM)
let messages = [];

// صحة السيرفر
app.get("/", (req, res) => {
    res.send("Chat API Running");
});

// إرسال رسالة
app.post("/send", (req, res) => {
    try {
        const username = req.body?.username;
        const message = req.body?.message;

        if (!username || !message) {
            return res.status(400).json({ success: false, error: "Missing data" });
        }

        messages.push({
            id: Date.now(),
            username: String(username),
            message: String(message)
        });

        // limit
        if (messages.length > 50) {
            messages.shift();
        }

        return res.json({ success: true });
    } catch (err) {
        console.log("SEND ERROR:", err);
        return res.status(500).json({ success: false });
    }
});

// جلب الرسائل
app.get("/messages", (req, res) => {
    try {
        return res.json({
            messages: messages || []
        });
    } catch (err) {
        console.log("GET ERROR:", err);
        return res.status(500).json({ messages: [] });
    }
});

// مهم جداً لـ Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port", PORT));
