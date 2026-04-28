const express = require("express");
const cors = require("cors");

const app = express();

// مهم جدًا للتوافق مع Roblox
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

let messages = [];

// صحة السيرفر فقط (بدون صفحات HTML)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "online"
    });
});

// إرسال رسالة
app.post("/send", (req, res) => {
    try {
        const username = req.body?.username;
        const message = req.body?.message;

        console.log("SEND:", req.body);

        if (!username || !message) {
            return res.status(400).json({ ok: false, error: "missing data" });
        }

        messages.push({
            id: Date.now(),
            username: String(username),
            message: String(message)
        });

        if (messages.length > 50) messages.shift();

        return res.json({ ok: true });
    } catch (err) {
        console.log("ERROR /send:", err);
        return res.status(500).json({ ok: false });
    }
});

// جلب الرسائل
app.get("/messages", (req, res) => {
    try {
        res.json({ messages });
    } catch (err) {
        res.status(500).json({ messages: [] });
    }
});

// Railway port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});
