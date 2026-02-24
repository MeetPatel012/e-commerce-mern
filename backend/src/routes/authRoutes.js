const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;



