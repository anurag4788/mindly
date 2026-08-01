const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // hashed password for local users
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: {
      type: String, // id from Google/GitHub for OAuth users
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;