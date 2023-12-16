import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes.js";
dotenv.config();

const app = express();
const port = 3000 || process.env.PORT;

console.log(
  "envs",
  process.env.NODE_ENV,
  process.env.PORT,
  process.env.PUP_CHROME
);

// Middleware to parse JSON data in the request body
app.use(json());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://scamless-frontend.netlify.app"
        : "http://localhost:5173",
  })
);
app.use(router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "An error occurred" });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
