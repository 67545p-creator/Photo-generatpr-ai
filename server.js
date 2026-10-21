
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("GitHub Photo Generator - Internet Server Online!");
});

app.get("/fetch", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      error: "URL gerekli",
      example: "/fetch?url=https://example.com"
    });
  }

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({
        error: "Yalnızca HTTP ve HTTPS adresleri desteklenir."
      });
    }

    const response = await fetch(parsed.href, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "GitHub-Photo-Generator/1.0"
      }
    });

    const content = await response.text();

    res.json({
      url: parsed.href,
      status: response.status,
      content: content.slice(0, 20000)
    });
  } catch {
    res.status(502).json({
      error: "İnternet adresine erişilemedi."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
