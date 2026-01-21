const mongoose = require("mongoose");

const RFIDLogSchema = new mongoose.Schema({
  uid: String,
  status: { type: String, enum: ["granted", "denied"] },
  type: { type: String, enum: ["resident", "visitor", "unknown"], default: "unknown" },
  name: String,
  plateNumber: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RFIDLog", RFIDLogSchema);
