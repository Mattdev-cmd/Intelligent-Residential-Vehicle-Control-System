const express = require("express");
const router = express.Router();
const Resident = require("../models/Resident");

// GET all registered residents
router.get("/", async (req, res) => {
  const residents = await Resident.find();
  res.json(residents);
});

// POST to register a new resident and vehicle
router.post("/", async (req, res) => {
  try {
    const { name, address, contact, uid, vehicle } = req.body;

    const existing = await Resident.findOne({ uid });
    if (existing) return res.status(400).json({ error: "UID already registered" });

    const newResident = new Resident({ name, address, contact, uid, vehicle });
    await newResident.save();

    res.status(201).json({ msg: "Resident registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register resident" });
  }
});

// Add and Delete Resident
// PUT - Update resident by UID
router.put("/:uid", async (req, res) => {
  try {
    const updated = await Resident.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Resident not found" });
    res.json({ msg: "Resident updated", resident: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE - Remove resident by UID
router.delete("/:uid", async (req, res) => {
  try {
    await Resident.findOneAndDelete({ uid: req.params.uid });
    res.json({ msg: "Resident deleted" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
