import express from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import ruleRoutes from "./routes/ruleRoutes.js";
// import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import cors from 'cors'

// Load environment variables
dotenv.config();

const app = express();

// Middleware for JSON parsing
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Allow the frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Ensure all necessary headers are allowed
  credentials: true  // If you need to send cookies or authentication tokens
}));
// app.use(cors({
//   origin: (origin, callback) => {
//     if (origin && /localhost(:[0-9]+)?$/.test(origin)) {
//       callback(null, true); // Allow the origin if it's localhost on any port
//     } else {
//       callback(new Error('Not allowed by CORS')); // Reject any other origins
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true  // Allow sending cookies or authorization headers
// }));

app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Request received from: ${clientIp}, Route: ${req.method} ${req.originalUrl}`);
  next();
});
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
