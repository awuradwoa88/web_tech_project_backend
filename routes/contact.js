const express = require("express");
const router = express.Router();
const pool = require("../db");


router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.status(201).json({ message: "Message saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save message" });
  }
});

module.exports = router;