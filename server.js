import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  const idea = req.body.idea;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "اكتب Lua script نظيف لـ Roblox." },
        { role: "user", content: idea }
      ]
    })
  });

  const data = await response.json();

  res.json({
    script: data.choices?.[0]?.message?.content || "error"
  });
});

app.listen(process.env.PORT || 3000);
