const express = require("express");
const router = express.Router();
const RFIDLog = require("../models/RFIDLog");
const Resident = require("../models/Resident");
const Visitor = require("../models/Visitor");

// GET logs
router.get("/logs", async (req, res) => {
  const { type, status, start, end } = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (start || end) {
    filter.timestamp = {};
    if (start) filter.timestamp.$gte = new Date(start);
    if (end) filter.timestamp.$lte = new Date(end + "T23:59:59");
  }

  try {
    const logs = await RFIDLog.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
});

// POST from ESP8266
router.post("/scan", async (req, res) => {
  const { uid } = req.body;

  try {
    let status = "denied";
    let accessType = "unknown";
    let name = null;
    let plateNumber = null;

    const resident = await Resident.findOne({ uid });
    if (resident) {
      status = "granted";
      accessType = "resident";
      name = resident.name;
      plateNumber = resident.vehicle.plateNumber;
    } else {
      const visitor = await Visitor.findOne({ uid });
      if (visitor) {
        status = "granted";
        accessType = "visitor";
        name = visitor.name;
        plateNumber = visitor.vehicle.plateNumber;
      }
    }

    await RFIDLog.create({ uid, status, type: accessType, name, plateNumber });

    res.json({ status, type: accessType, name, plateNumber });
  } catch (err) {
    console.error("Error processing scan:", err);
    res.status(500).json({ error: "Failed to process scan" });
  }
});

module.exports = router;
