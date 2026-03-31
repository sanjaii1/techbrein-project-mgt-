import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Database connected successfully");
});