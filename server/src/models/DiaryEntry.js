const mongoose = require("mongoose");

const diaryEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String, // AI-generated summary
    },
    mood: {
      type: String, // e.g., "happy", "sad", "calm"
    },
    tags: {
      type: [String], // array of strings
      default: [],
    },
  },
  { timestamps: true }
);

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);

module.exports = DiaryEntry;