import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";
import { checkEnvironment } from "./utils.js";

dotenv.config();

const app = express();

app.use(cors());
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
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests thoughtful gift ideas based on user interests. Make these suggestions thoughtful and practical. Your response must be under 500 words. Skip intros and conclusions.Only output gift suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("AI response:");
    console.log(response.choices[0].message.content);
    const message = response.choices[0].message.content;

    res.json({ suggestion: message });
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
