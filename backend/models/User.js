const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "guard"], default: "guard" }
});

module.exports = mongoose.model("User", UserSchema);
