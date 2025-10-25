import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "WebCourse AI Chatbot",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter error:", data.error);
      return res.status(400).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "Không có phản hồi.";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "Lỗi server hoặc kết nối OpenRouter thất bại." });
  }
};
