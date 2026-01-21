const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// Register new visitor
router.post("/", async (req, res) => {
  try {
    const { name, contact, reason, uid, vehicle } = req.body;

    if (!name || !contact || !reason || !uid || !vehicle) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Visitor.findOne({ uid });
    if (existing) return res.status(400).json({ error: "UID already registered to another visitor" });

    const visitor = new Visitor({ name, contact, reason, uid, vehicle });
    await visitor.save();

    res.status(201).json({ msg: "Visitor registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register visitor" });
  }
});

// Get all visitors
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch visitors" });
  }
});

// Update visitor by UID
router.put("/:uid", async (req, res) => {
  try {
    const updated = await Visitor.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Visitor not found" });
    res.json({ msg: "Visitor updated", visitor: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete visitor
router.delete("/:uid", async (req, res) => {
  try {
    await Visitor.findOneAndDelete({ uid: req.params.uid });
    res.json({ msg: "Visitor deleted" });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
