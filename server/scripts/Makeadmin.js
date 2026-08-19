// Run: node scripts/makeAdmin.js someone@example.com
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js <email>");
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminRole = await Role.findOrCreate("admin");

    const user = await User.findOneAndUpdate(
      { email },
      { role: adminRole._id },
      { new: true },
    ).populate("role");

    if (!user) {
      console.error(`No user found with email "${email}". Sign up first.`);
      process.exit(1);
    }

    console.log(`${user.email} is now an admin (role: ${user.role.name}).`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
