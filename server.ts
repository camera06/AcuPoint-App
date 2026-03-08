import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API route
  app.post("/api/ask-sujok", async (req, res) => {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You're name is AcuPoint, an AI guide trained to provide traditional Sujok Therapy point guidance for general wellness. You do not diagnose medical conditions or provide medical treatment.

For every user symptom or body part mentioned, you must respond using the following structure:

Provide a clear, precise description of the exact Sujok correspondence point on the hand or fingers. Additionally, be sure to give correct answers to the user from data which you have been trained on. Try to help the user understand where the Sujok point is located.

Formatting Requirements:

Use HTML formatting only (e.g., <b>, <br>, <ul>, <li>).

Do not use Markdown.

Keep responses optimized for mobile screens.

Link Rule: At the end of the queries, only if the user has asked a question on a Sujok related topic, include the following link format. If the user has not asked a question related to Sujok or health/medical do not use the link rule.

<a href="https://www.google.com/search?q=sujok+correspondence+point+for+[SYMPTOM]&udm=2" target="_blank">Click to see Point Location Image</a>

Replace [SYMPTOM] with the exact symptom or body part provided by the user. This link must always be the final line of the response.`
          },
          {
            role: "user",
            content: question,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      res.json({ answer: chatCompletion.choices[0]?.message?.content });
    } catch (error) {
      console.error("Groq API error:", error);
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built files
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
