const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all users (admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // omit password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Add user
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ msg: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Delete user
router.delete("/:email", async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});
// Update user (name or role) by email
router.put("/:email", async (req, res) => {
  const { name, role } = req.body;

  try {
    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, role },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ msg: "User updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});


module.exports = router;
