require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbconnect = require("./config/db");
const AuthRoutes = require("./routes/authRoutes");
const DiaryRoutes = require("./routes/diaryRoutes");


const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

dbconnect();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", AuthRoutes );
app.use("/api/diary" , DiaryRoutes );


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
process.on('exit', () => {
  console.log('Server process exiting');
});
