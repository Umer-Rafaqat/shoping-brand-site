// Run ONCE: node scripts/migrateRoles.js
require("dotenv").config();
const mongoose = require("mongoose");
const Role = require("../models/Role");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const userRole = await Role.findOrCreate("user");
    const adminRole = await Role.findOrCreate("admin");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    const toUser = await usersCollection.updateMany(
      { role: "user" },
      { $set: { role: userRole._id } },
    );
    const toAdmin = await usersCollection.updateMany(
      { role: "admin" },
      { $set: { role: adminRole._id } },
    );

    console.log(`Migrated ${toUser.modifiedCount} user(s) to the "user" role.`);
    console.log(
      `Migrated ${toAdmin.modifiedCount} user(s) to the "admin" role.`,
    );
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
