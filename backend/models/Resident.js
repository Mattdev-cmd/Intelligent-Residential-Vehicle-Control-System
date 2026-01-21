const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
  uid: { type: String, required: true, unique: true }, // RFID tag UID
  vehicle: {
    plateNumber: String,
    model: String,
    color: String,
  },
});

module.exports = mongoose.model("Resident", ResidentSchema);
