import express from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import ruleRoutes from "./routes/ruleRoutes.js";
// import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/rules", ruleRoutes);

// Error handling middleware
// app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
