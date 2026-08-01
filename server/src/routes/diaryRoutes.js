const express = require("express");
const { GetDiaryEntries ,AddNewEntry,GetDiaryEntryById,UpdateDiaryEntry,DeleteDiaryEntry, GenerateSummary} = require("../controllers/diaryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/entries" , authMiddleware , GetDiaryEntries);
router.post("/entries" , authMiddleware , AddNewEntry);
router.get("/entries/:id" , authMiddleware , GetDiaryEntryById);
router.delete("/entries/:id" , authMiddleware , DeleteDiaryEntry);
router.put("/entries/:id" , authMiddleware , UpdateDiaryEntry);

router.post("/entries/:id/generate-summary",authMiddleware, GenerateSummary);

module.exports = router;