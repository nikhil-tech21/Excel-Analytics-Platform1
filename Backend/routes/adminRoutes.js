const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getAdminData } = require("../controllers/adminController");

// @desc   Get all users + uploads (Admin only)
// @route  GET /api/admin/data
// @access Private/Admin
router.get("/data", protect, admin, getAdminData);

module.exports = router;