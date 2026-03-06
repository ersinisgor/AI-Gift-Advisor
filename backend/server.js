import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { checkEnvironment } from "./utils.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://ai-gift-advisor.onrender.com",
  })
);
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

checkEnvironment();

app.post("/api/gift-suggestion", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  console.log("Gift suggestion request:", prompt);

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that suggests thoughtful gift ideas based on user interests. Make these suggestions thoughtful and practical. Your response must be under 500 words. Skip intros and conclusions. Only output gift suggestions. Format the response in Markdown. Use response format below.
                        
          Format:
          1. Gift name (bold font weight)
          Short explanation (1-2 sentence in new line)
          Price Range: Estimated price range (in new line)
          
          Examples: 
          1. **Premium Spinning Rod and Reel Combo**
          A well-balanced freshwater rod and smooth-reeling reel that improves sensitivity and reduces fatigue on long days on the water.
          Price Range: $120-$300
          
          2. **Durable Fishing Vest with Pockets**
          Lightweight, breathable vest with multiple pockets to keep tackle, pliers, and snacks within easy reach.
          Price Range: $40-$120`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.flushHeaders();

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;

      if (content) {
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    const status = error?.status || error?.response?.status;

    if (status === 401 || status === 403) {
      console.error(
        "Authentication error: Check your AI_KEY and make sure it’s valid."
      );
    } else if (status >= 500) {
      console.error(
        "AI provider error: Something went wrong on the provider side. Try again shortly."
      );
    } else {
      console.error("Unexpected error:", error.message || error);
    }

    res.status(500).json({ error: "Failed to fetch AI suggestion" });
  }
});

const __dirname = new URL(".", import.meta.url).pathname;

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
