const DiaryEntry = require("../models/DiaryEntry");
const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


exports.GetDiaryEntries = async (req, res) => {
  try {
    const user = req.user;

    // 1. Check if user exists from middleware
    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    // 2. Fetch entries for this user
    const allEntries = await DiaryEntry.find({ user: user.userId }).sort({ createdAt: -1 });

    // 3. Success response (even if no entries)
    return res.status(200).json({
      message: "Found",
      success: true,
      data: allEntries || [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Getting all entries",
    });
  }
};

exports.AddNewEntry = async (req, res) => {
  try {
    const user = req.user;

    // 1. Check if user exists from middleware
    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    const { title, content } = req.body;

    // 2. Validate fields
    if (!title || !content) {
      return res.status(400).json({
        message: "Please Enter All Fields",
      });
    }

    // 3. Create new diary entry
    const newEntry = await DiaryEntry.create({
      user: user.userId,
      title,
      content,
      summary: "",
      mood: "",
      tags: [],
    });

    // 4. Success response
    return res.status(201).json({
      message: "Entry Created Successfully",
      success: true,
      data: newEntry,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Add New Entry",
    });
  }
};

exports.GetDiaryEntryById = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    const { id } = req.params;

    const entry = await DiaryEntry.findOne({
      _id: id,
      user: user.userId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    return res.status(200).json({
      message: "Entry found",
      success: true,
      data: entry,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Get Diary Entry By ID",
    });
  }
};
exports.DeleteDiaryEntry = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    const { id } = req.params;

    const entry = await DiaryEntry.findOneAndDelete({
      _id: id,
      user: user.userId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    return res.status(200).json({
      message: "Entry deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Delete Diary Entry",
    });
  }
};
exports.UpdateDiaryEntry = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    const { id } = req.params;
    const { title, content, summary, mood, tags } = req.body;

    const entry = await DiaryEntry.findOne({
      _id: id,
      user: user.userId,
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    // Partial update: only update fields that are provided
    if (title) entry.title = title;
    if (content) entry.content = content;
    if (summary) entry.summary = summary;
    if (mood) entry.mood = mood;
    if (tags) entry.tags = tags;

    await entry.save();

    return res.status(200).json({
      message: "Entry updated successfully",
      success: true,
      data: entry,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Update Diary Entry",
    });
  }
};

exports.GenerateSummary = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "No user found from middleware",
      });
    }

    const { id } = req.params;

    const entry = await DiaryEntry.findOne({
      _id: id
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entry not found",
      });
    }

    if (!entry.content || entry.content.trim().length === 0) {
      return res.status(400).json({
        message: "Entry has no content to summarize",
      });
    }

    const prompt =
      `Summarize this diary entry in 2–3 sentences, keeping the tone personal and gentle:\n\n` +
      entry.content;

    // Use genAI.models.generateContent directly
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Handle different SDK shapes safely
    const summary =
      typeof result?.text === "string"
        ? result.text
        : typeof result?.response?.text === "string"
        ? result.response.text
        : typeof result?.response?.text === "function"
        ? result.response.text()
        : "";

    if (!summary) {
      return res.status(500).json({
        message: "AI returned empty summary",
      });
    }

    entry.summary = summary;
    await entry.save();

    return res.status(200).json({
      message: "Summary generated successfully",
      success: true,
      summary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occur in Generate Summary",
    });
  }
};