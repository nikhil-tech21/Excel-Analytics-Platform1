const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    let admin = await User.findOne({ email: "admin@admin.com" });

    // Hash the default admin password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    if (admin) {
      console.log("⚠️ Admin already exists, updating credentials...");
      admin.name = "Super Admin";
      admin.password = hashedPassword; // reset password
      admin.role = "admin";            // enforce admin role
      admin.isAdmin = true;            // enforce isAdmin flag
      await admin.save();

      console.log("✅ Admin updated successfully:", {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isAdmin: admin.isAdmin,
        updatedAt: admin.updatedAt,
      });
    } else {
      const adminUser = new User({
        name: "Super Admin",
        email: "admin@admin.com",
        password: hashedPassword,
        role: "admin",
        isAdmin: true,
      });

      await adminUser.save();

      console.log("✅ New Admin created:", {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        isAdmin: adminUser.isAdmin,
        createdAt: adminUser.createdAt,
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();