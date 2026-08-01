require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbconnect = require("./config/db");
const AuthRoutes = require("./routes/authRoutes");
const DiaryAuth = require("./routes/diaryRoutes");

const User = require("./models/User");
const DiaryEntry = require("./models/DiaryEntry");

const app = express();

app.use(cors())
app.use(express.json());

dbconnect();

app.use("/api/auth", AuthRoutes );
app.use("/api/diary" , DiaryAuth );


const PORT = process.env.PORT_NUMBER;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
process.on('exit', () => {
  console.log('Server process exiting');
});
