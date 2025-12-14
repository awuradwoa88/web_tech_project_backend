const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/:id/borrowed", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
     SELECT b.id, b.title, b.category, br.due_date
     FROM borrows br
     JOIN books b ON br.book_id = b.id
     WHERE br.user_id = $1 AND br.returned = FALSE 
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch borrowed books" });
  }
});

module.exports = router;