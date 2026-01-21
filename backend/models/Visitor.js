const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  name: String,
  contact: String,
  reason: String,
  uid: { type: String, required: true, unique: true },
  vehicle: {
    plateNumber: String,
    model: String,
    color: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visitor", VisitorSchema);
