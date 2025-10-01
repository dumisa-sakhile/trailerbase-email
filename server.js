import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Resend } from "resend";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Initialize Resend
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  resend = new Resend(process.env.RESEND_API_KEY);
} catch (error) {
  console.error("Failed to initialize Resend:", error.message);
  process.exit(1); // Exit if Resend initialization fails
}

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

// CORS configuration
const corsOptions = {
  origin: [
    "https://www.trailerbase.tech",
    "https://trailerbase.tech",
    "https://trailer-base.vercel.app/",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


app.use("/email", emailRoutes(resend)); // Email routes at /email/api/...


// Health check endpoints
app.get("/", (req, res) => {
  res.status(200).json({ message: "Trailerbase Email API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong!",
  });
});


  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`MongoDB: Connected`);
    console.log(`Resend: ${resend ? 'Initialized' : 'Not configured'}`);
  });


export default app;