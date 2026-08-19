const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

roleSchema.statics.findOrCreate = async function (name) {
  return this.findOneAndUpdate(
    { name },
    { name },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
};

module.exports = mongoose.model("Role", roleSchema);
