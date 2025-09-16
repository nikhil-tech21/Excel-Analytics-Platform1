const User = require("../models/User");
const Upload = require("../models/Upload");

// @desc    Get all users + uploads (Admin only)
// @route   GET /api/admin/data
// @access  Private/Admin
const getAdminData = async (req, res) => {
  try {
    // ✅ Ensure user is logged in and is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // ✅ Fetch all users (only email + role fields)
    const users = await User.find({}, "email role").lean();

    // ✅ Fetch all uploads with user info
    const uploads = await Upload.find({})
      .populate("user", "email")
      .select("fileName chartType createdAt")
      .lean();

    const formattedUploads = uploads.map((upload) => ({
      userEmail: upload.user?.email || "Unknown",
      fileName: upload.fileName,
      chartType: upload.chartType,
      uploadDate: upload.createdAt,
    }));

    res.json({
      users: users.map((u) => ({
        email: u.email,
        role: u.role,
      })),
      uploads: formattedUploads,
    });
  } catch (error) {
    console.error("❌ Admin data fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAdminData };