require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Create app FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bookRoutes = require("./backend/routes/books");
const authRoutes = require("./backend/routes/auth");
const contactRoutes = require("./backend/routes/contact");

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});