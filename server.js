require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",   // allow all during development
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/users"); // ✅ REQUIRED

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes); // ✅ THIS FIXES THE 404

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});