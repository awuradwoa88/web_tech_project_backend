const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =========================
   STUDENT: GET BOOKS
========================= */
router.get("/", async (req, res) => {
  const userId = req.query.userId;

  try {
    const available = await pool.query(
      `
      SELECT *
      FROM books
      WHERE id NOT IN (
        SELECT book_id FROM borrows WHERE user_id = $1
      )
      ORDER BY id
      `,
      [userId]
    );

    const borrowed = await pool.query(
      `
      SELECT b.*, br.borrowed_at
      FROM borrows br
      JOIN books b ON b.id = br.book_id
      WHERE br.user_id = $1
      `,
      [userId]
    );

    res.json({
      available: available.rows,
      borrowed: borrowed.rows
    });
  } catch (err) {
    console.error("Books error:", err);
    res.status(500).json({ message: "Failed to load books" });
  }
});

/* =========================
   BORROW BOOK
========================= */
router.post("/borrow/:id", async (req, res) => {
  const { userId } = req.body;
  const bookId = req.params.id;

  try {
    await pool.query(
      "INSERT INTO borrows (user_id, book_id) VALUES ($1,$2)",
      [userId, bookId]
    );
    res.json({ message: "Book borrowed" });
  } catch (err) {
    console.error("Borrow error:", err);
    res.status(500).json({ message: "Borrow failed" });
  }
});

/* =========================
   RETURN BOOK
========================= */
router.post("/return/:id", async (req, res) => {
  const { userId } = req.body;
  const bookId = req.params.id;

  try {
    await pool.query(
      "DELETE FROM borrows WHERE user_id=$1 AND book_id=$2",
      [userId, bookId]
    );
    res.json({ message: "Book returned" });
  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: "Return failed" });
  }
});

/* =========================
   ADMIN: GET ALL BOOKS
========================= */
router.get("/admin/all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, category FROM books ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Admin books error:", err);
    res.status(500).json({ message: "Failed to load books" });
  }
});

/* =========================
   ADMIN: ADD BOOK
========================= */
router.post("/", async (req, res) => {
  const { title, category } = req.body;

  try {
    await pool.query(
      "INSERT INTO books (title, category) VALUES ($1,$2)",
      [title, category]
    );
    res.json({ message: "Book added" });
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ message: "Add failed" });
  }
});

/* =========================
   ADMIN: UPDATE BOOK
========================= */
router.put("/:id", async (req, res) => {
  const { title, category } = req.body;

  try {
    await pool.query(
      "UPDATE books SET title=$1, category=$2 WHERE id=$3",
      [title, category, req.params.id]
    );
    res.json({ message: "Book updated" });
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   ADMIN: DELETE BOOK
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM books WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error("Delete book error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;