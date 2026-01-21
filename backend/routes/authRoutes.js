const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Log = require("../models/Log");

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("REGISTER REQUEST BODY:", req.body); // 👈 ADD THIS

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User({ name, email, password, role: role || "guard" });
    await newUser.save();

    console.log("User registered:", newUser);

    res.status(201).json({
      msg: "User registered",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN REQUEST BODY:", req.body); // 👈 ADD THIS

  try {
  const user = await User.findOne({ email });

  const log = new Log({
    type: "login",
    message: user && user.password === password ? "Login successful" : "Login failed",
    actor: email
  });
  await log.save();

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

    console.log("User logged in:", user);

    res.json({
      msg: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
