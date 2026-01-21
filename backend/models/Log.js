const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  type: String, // "login", "rfid", "admin"
  message: String,
  actor: String, // email or "system"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", LogSchema);
