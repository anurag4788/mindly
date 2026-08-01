const express = require("express");
const { TestAPI ,RegisterUser,LoginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register" , RegisterUser );
router.post("/login" , LoginUser );

module.exports = router ;